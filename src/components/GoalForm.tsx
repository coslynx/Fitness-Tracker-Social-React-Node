import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, DatePicker, Grid } from '@mui/material';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../utils/types';
import { API_URL } from '../utils/constants';

const GoalForm: React.FC = () => {
  const [goal, setGoal] = useState<Goal>({
    description: '',
    targetValue: '',
    deadline: new Date(),
  });
  const [error, setError] = useState<string | null>(null);

  const { createGoal } = useGoals();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await createGoal(goal);
      setGoal({ description: '', targetValue: '', deadline: new Date() });
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while creating the goal.');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setGoal((prevGoal) => ({ ...prevGoal, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setGoal((prevGoal) => ({ ...prevGoal, deadline: date }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Set Your Fitness Goal
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Goal Description"
            name="description"
            value={goal.description}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Target Value"
            name="targetValue"
            value={goal.targetValue}
            onChange={handleChange}
            fullWidth
            required
            type="number"
            InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DatePicker
            label="Deadline"
            value={goal.deadline}
            onChange={handleDateChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" type="submit" fullWidth>
            Set Goal
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

export default GoalForm;