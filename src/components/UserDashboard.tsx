import React, { useEffect, useState } from 'react';
import { Grid, Typography, AppBar, Toolbar, Button, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { useWorkouts } from '../hooks/useWorkouts';
import GoalCard from './GoalCard';
import WorkoutList from './WorkoutList';
import { User, Goal, Workout } from '../utils/types';
import { API_URL } from '../utils/constants';

const UserDashboard: React.FC<{ error: string | null }> = ({ error }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { goals, fetchGoals } = useGoals();
  const { workouts, fetchWorkouts } = useWorkouts();

  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
      fetchWorkouts();
    }
  }, [isAuthenticated, fetchGoals, fetchWorkouts]);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Fitness Tracker</Typography>
          <Button color="inherit" onClick={() => logout()}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        {/* User Profile Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Welcome, {user?.name || 'User'}!
          </Typography>
          {/* Display User's Avatar */}
          {/* You'll need to implement avatar display based on your design */}
        </Grid>
        {/* Goals Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Your Goals
          </Typography>
          <Grid container spacing={2}>
            {goals.map((goal: Goal) => (
              <Grid item xs={12} md={6} key={goal.id}>
                <GoalCard goal={goal} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* Workouts Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Your Workouts
          </Typography>
          <WorkoutList workouts={workouts} />
        </Grid>
      </Grid>
      {/* Handle Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default UserDashboard;