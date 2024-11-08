import React, { useState, useEffect } from 'react';
import { 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  CircularProgress,
  Alert 
} from '@mui/material';
import { Workout } from '../utils/types';
import { useWorkouts } from '../hooks/useWorkouts'; 
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '../utils/helpers'; 

interface WorkoutListProps {
  workouts: Workout[]; 
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts }) => {
  const { workouts: fetchedWorkouts, isLoading, error, fetchWorkouts, deleteWorkout } = useWorkouts();
 
  useEffect(() => {
    fetchWorkouts(); 
  }, []);

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await deleteWorkout(workoutId);
      fetchWorkouts();
    } catch (error) {
      // Handle the error appropriately
      console.error('Error deleting workout:', error);
    }
  };

  if (isLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <List>
      {fetchedWorkouts.map((workout: Workout) => (
        <ListItem key={workout.id}>
          <ListItemAvatar>
            <Avatar>
              {/* You can customize this with an icon representing the workout type */}
              {/* For example, a running icon for cardio, a weight icon for strength training */}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">
                {formatDate(workout.date)} - {workout.activity}
              </Typography>
            }
            secondary={
              <Typography variant="body2">
                Duration: {workout.duration} minutes
                {/* Add more workout details as needed */}
              </Typography>
            }
          />
          <IconButton aria-label="delete" onClick={() => handleDeleteWorkout(workout.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default WorkoutList;