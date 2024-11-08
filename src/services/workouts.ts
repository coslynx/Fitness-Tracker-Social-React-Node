import axios from 'axios';
import { API_URL } from '../utils/constants';
import { Workout } from '../utils/types';
import { sanitizeInput } from '../utils/helpers';

class WorkoutService {
  async createWorkout(workout: Workout): Promise<Workout> {
    try {
      const sanitizedWorkout = {
        ...workout,
        notes: sanitizeInput(workout.notes),
      };
      const response = await axios.post<Workout>(`${API_URL}/workouts`, sanitizedWorkout);
      return response.data;
    } catch (error: any) {
      console.error('Error creating workout:', error);
      throw new Error('Failed to create workout');
    }
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    try {
      const response = await axios.get<Workout[]>(`${API_URL}/workouts?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching workouts:', error);
      throw new Error('Failed to fetch workouts');
    }
  }

  async updateWorkout(workout: Workout): Promise<Workout> {
    try {
      const response = await axios.put<Workout>(`${API_URL}/workouts/${workout.id}`, workout);
      return response.data;
    } catch (error: any) {
      console.error('Error updating workout:', error);
      throw new Error('Failed to update workout');
    }
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/workouts/${workoutId}`);
    } catch (error: any) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  }
}

const workoutService = new WorkoutService();

export default workoutService;