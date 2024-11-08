import React from 'react';
import { Card, CardContent, Typography, Grid, LinearProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Goal } from '../utils/types';
import { formatDate } from '../utils/helpers';

interface GoalCardProps {
  goal: Goal;
  onDelete: (goalId: string) => void;
  onEdit: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete, onEdit }) => {
  const { description, targetValue, deadline } = goal;

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {description}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body2">
              Target Value: {targetValue}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              Deadline: {formatDate(deadline)}
            </Typography>
          </Grid>
          {/* Placeholder for progress bar */}
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={50} />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" alignItems="flex-end" spacing={1} sx={{ mt: 1 }}>
          <Grid item>
            <IconButton aria-label="edit" onClick={() => onEdit(goal.id)}>
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton aria-label="delete" onClick={() => onDelete(goal.id)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GoalCard;