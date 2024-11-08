import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, DatePicker, Select, MenuItem, Alert } from '@mui/material';
import { useWorkouts } from '../hooks/useWorkouts';
import { Workout } from '../utils/types';
import { API_URL } from '../utils/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate, sanitizeInput } from '../utils/helpers'; 

const WorkoutForm: React.FC = () => {
  const [workout, setWorkout] = useState<Workout>({
    date: new Date(),
    duration: '',
    activity: '',
    intensity: '',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { createWorkout } = useWorkouts();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setWorkout((prevWorkout) => ({ ...prevWorkout, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); 

    // Validation Logic
    if (!workout.date || !workout.duration || !workout.activity || !workout.intensity) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isNaN(Number(workout.duration))) {
      setError('Duration must be a number.');
      return;
    }

    try {
      await createWorkout({
        ...workout, 
        notes: sanitizeInput(workout.notes),
      });
      setWorkout({
        date: new Date(),
        duration: '',
        activity: '',
        intensity: '',
        notes: '',
      });
      // Handle success: show a success message or redirect to a workout list
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while saving the workout.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Log Your Workout
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DatePicker
            label="Workout Date"
            value={workout.date}
            onChange={(date) => setWorkout({ ...workout, date })}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Duration (minutes)"
            type="number"
            name="duration"
            value={workout.duration}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            label="Activity"
            name="activity"
            value={workout.activity}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="Cardio">Cardio</MenuItem>
            <MenuItem value="Strength">Strength Training</MenuItem>
            <MenuItem value="Flexibility">Flexibility</MenuItem>
            {/* Add more activity options here */}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            label="Intensity"
            name="intensity"
            value={workout.intensity}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Notes"
            name="notes"
            value={workout.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" type="submit" fullWidth>
            Log Workout
          </Button>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default WorkoutForm;