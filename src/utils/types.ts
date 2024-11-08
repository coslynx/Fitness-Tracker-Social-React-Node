// src/utils/types.ts

// Import necessary types from other packages.
import { AxiosResponse } from 'axios';

// Define interface for user data.
export interface User {
  id: string;
  email: string;
  name?: string; // This is optional - we might add name later
}

// Define interface for goal data.
export interface Goal {
  id: string;
  description: string;
  targetValue: string; // This could be a number or string, depending on goal type 
  deadline: Date;
  userId: string; 
}

// Define interface for workout data.
export interface Workout {
  id: string;
  date: Date;
  duration: string; // This could be a number or string, depending on duration format
  activity: string;
  intensity: string;
  notes?: string; // This is optional, for user notes
  userId: string; 
}

// Define interface for the response format from the backend.
export interface ApiResponse<T> {
  data: T; 
  message: string; 
  success: boolean;
}

// Define interface for the error response format from the backend.
export interface ApiError {
  code: string; 
  message: string; 
}

// Define interface for the registration response format from the backend.
export interface RegistrationResponse {
  token: string;
  user: User;
}

// Define type for the authentication token.
export type Token = string;

// Define type for the authentication state.
export type AuthState = {
  token: Token | null;
  user: User | null;
};

// Define type for the goal creation response from the backend.
export type GoalCreationResponse = AxiosResponse<ApiResponse<Goal>>;

// Define type for the workout creation response from the backend.
export type WorkoutCreationResponse = AxiosResponse<ApiResponse<Workout>>;

// Define type for the authentication error.
export type AuthenticationError = Error & {
  code?: string; // We can add error codes for specific errors
};

// Define type for the goal fetch response from the backend.
export type GoalFetchResponse = AxiosResponse<ApiResponse<Goal[]>>;

// Define type for the workout fetch response from the backend.
export type WorkoutFetchResponse = AxiosResponse<ApiResponse<Workout[]>>;

// Define type for the goal update response from the backend.
export type GoalUpdateResponse = AxiosResponse<ApiResponse<Goal>>;

// Define type for the workout update response from the backend.
export type WorkoutUpdateResponse = AxiosResponse<ApiResponse<Workout>>;

// Define type for the goal deletion response from the backend.
export type GoalDeleteResponse = AxiosResponse<ApiResponse<void>>;

// Define type for the workout deletion response from the backend.
export type WorkoutDeleteResponse = AxiosResponse<ApiResponse<void>>;

// Define type for the registration response from the backend.
export type RegistrationResponse = AxiosResponse<ApiResponse<RegistrationResponse>>;