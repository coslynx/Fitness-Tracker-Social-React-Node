#!/bin/bash
# Set strict error handling
set -euo pipefail

# Environment variables
source .env

# Project root directory
PROJECT_ROOT=$(pwd)

# Log file location
LOG_FILE="${PROJECT_ROOT}/logs/startup.log"

# PID file location
PID_FILE="${PROJECT_ROOT}/logs/pids.txt"

# Service timeouts
BACKEND_TIMEOUT=30
FRONTEND_TIMEOUT=30

# Health check intervals
HEALTH_CHECK_INTERVAL=1

# Utility functions
log_info() {
  date +"%Y-%m-%d %H:%M:%S"
  echo "INFO: $*"
}

log_error() {
  date +"%Y-%m-%d %H:%M:%S" >&2
  echo "ERROR: $*" >&2
}

cleanup() {
  log_info "Cleaning up processes and files"
  rm -f "${PID_FILE}"
  pkill -f "fitness-tracker-mvp"
}

check_dependencies() {
  log_info "Checking required tools"
  command -v npm >/dev/null 2>&1 || { log_error "npm is not installed"; exit 1; }
  command -v node >/dev/null 2>&1 || { log_error "node is not installed"; exit 1; }
}

# Health checks
check_port() {
  local port="$1"
  nc -z localhost "${port}" >/dev/null 2>&1
}

wait_for_service() {
  local service="$1"
  local timeout="$2"
  local interval="$3"
  local counter=0
  while [[ "$counter" -lt "$timeout" ]]; do
    if check_port "$service"; then
      log_info "$service is running"
      return 0
    fi
    sleep "$interval"
    ((counter++))
  done
  log_error "$service failed to start within timeout"
  exit 1
}

verify_service() {
  local service="$1"
  local timeout="$2"
  local interval="$3"
  local counter=0
  while [[ "$counter" -lt "$timeout" ]]; do
    if check_port "$service"; then
      log_info "$service is running and healthy"
      return 0
    fi
    sleep "$interval"
    ((counter++))
  done
  log_error "$service is not healthy within timeout"
  exit 1
}

# Service management
start_database() {
  log_info "Starting database"
  pg_ctl start -D /var/lib/postgresql/data
  wait_for_service 5432 30 1
}

start_backend() {
  log_info "Starting backend server"
  cd "${PROJECT_ROOT}"
  npm run build
  npm run start &
  store_pid $!
  wait_for_service 3000 30 1
}

start_frontend() {
  log_info "Starting frontend server"
  cd "${PROJECT_ROOT}"
  npm run dev &
  store_pid $!
  wait_for_service 3001 30 1
}

store_pid() {
  local pid="$1"
  echo "$pid" >> "${PID_FILE}"
}

# Main execution flow
check_dependencies
log_info "Starting Fitness Tracker MVP"

# Start database (if applicable)
start_database

# Start backend
start_backend

# Start frontend (if separate)
start_frontend

# Startup completion
log_info "Fitness Tracker MVP started successfully"

# Trap exit and error signals
trap cleanup EXIT ERR

wait