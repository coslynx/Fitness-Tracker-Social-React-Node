import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Goal } from '../utils/types';
import goalService from '../services/goals';

const useGoals = (): {
  goals: Goal[];
  fetchGoals: () => void;
  createGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
} => {
  const queryClient = useQueryClient();
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchGoals = () => {
    useQuery<Goal[], Error>(
      'goals',
      () => goalService.getGoals(),
      {
        onSuccess: (data) => setGoals(data),
        onError: (error) => {
          console.error('Error fetching goals:', error);
        },
      }
    );
  };

  const createGoal = async (newGoal: Goal): Promise<void> => {
    try {
      const createdGoal = await goalService.createGoal(newGoal);
      setGoals((prevGoals) => [...prevGoals, createdGoal]);
      queryClient.setQueryData('goals', (prevGoals: Goal[]) => [...prevGoals, createdGoal]);
    } catch (error: any) {
      console.error('Error creating goal:', error);
      throw error;
    }
  };

  const updateGoal = async (updatedGoal: Goal): Promise<void> => {
    try {
      const updatedGoalResponse = await goalService.updateGoal(updatedGoal);
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === updatedGoalResponse.id ? updatedGoalResponse : goal
        )
      );
      queryClient.setQueryData('goals', (prevGoals: Goal[]) =>
        prevGoals.map((goal) =>
          goal.id === updatedGoalResponse.id ? updatedGoalResponse : goal
        )
      );
    } catch (error: any) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (goalId: string): Promise<void> => {
    try {
      await goalService.deleteGoal(goalId);
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      queryClient.setQueryData('goals', (prevGoals: Goal[]) =>
        prevGoals.filter((goal) => goal.id !== goalId)
      );
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  return {
    goals,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
};

export default useGoals;