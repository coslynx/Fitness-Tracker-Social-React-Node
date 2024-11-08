// src/hooks/useWorkouts.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Workout, WorkoutCreationResponse, WorkoutFetchResponse, WorkoutUpdateResponse, WorkoutDeleteResponse } from '../utils/types';
import workoutService from '../services/workouts'; // This service handles the API interactions

// This hook will be responsible for all workout-related actions in our app
const useWorkouts = (): {
  workouts: Workout[]; // Stores the fetched workouts
  isLoading: boolean; // Flag to indicate if we're fetching workouts
  error: Error | null; // Stores any error encountered during fetching or operations
  fetchWorkouts: () => void; // Function to fetch workouts for the current user
  createWorkout: (workout: Workout) => Promise<void>; // Function to create a new workout
  updateWorkout: (workout: Workout) => Promise<void>; // Function to update an existing workout
  deleteWorkout: (workoutId: string) => Promise<void>; // Function to delete a workout
} => {
  const queryClient = useQueryClient(); // We'll use this to invalidate caches after updates/deletes
  const [workouts, setWorkouts] = useState<Workout[]>([]); // Initial state for fetched workouts
  const [isLoading, setIsLoading] = useState(false); // Flag to indicate if we're fetching data
  const [error, setError] = useState<Error | null>(null); // Error state

  // Fetch workouts for the current user
  const fetchWorkouts = () => {
    //  Get the user ID from the authentication state (we'll assume this is readily available)
    const userId = "YOUR_USER_ID"; // Replace with actual ID retrieval
    // This is a crucial point for integration - you'll need to access the current user's ID from your authentication hook (`useAuth`)

    // Utilize `react-query` to manage the fetch request
    useQuery<Workout[], Error>(
      ['workouts', userId], // Unique key for this query - we're using the user ID for personalization
      () => workoutService.getWorkouts(userId), // The function to fetch workouts from the backend
      {
        onSuccess: (data) => { // Callback when the query succeeds
          setWorkouts(data); // Update the state with the fetched workouts
          setIsLoading(false); // Set the loading flag to false
          setError(null); // Clear any previous errors
        },
        onError: (error) => { // Callback if an error occurs
          console.error('Error fetching workouts:', error); // Log the error
          setIsLoading(false); // Set the loading flag to false
          setError(error); // Update the error state
        },
        refetchOnWindowFocus: false, // Don't refetch every time the window gains focus 
        refetchInterval: 60000, // Refetch the workouts every minute to keep the data updated
        refetchIntervalInBackground: true // Continue refetching even if the user is inactive
      }
    );
  };

  // Create a new workout
  const createWorkout = useMutation(
    (newWorkout: Workout) => workoutService.createWorkout(newWorkout), // The function to create a workout in the backend
    {
      onSuccess: (data, variables) => { // Callback when the mutation succeeds
        queryClient.invalidateQueries('workouts'); // Invalidate the 'workouts' cache to reflect the new workout
        setWorkouts((prevWorkouts) => [...prevWorkouts, data]); // Add the newly created workout to the state
        setIsLoading(false); // Set the loading flag to false
        setError(null); // Clear any previous errors
      },
      onError: (error, variables) => { // Callback if an error occurs
        console.error('Error creating workout:', error); // Log the error
        setIsLoading(false); // Set the loading flag to false
        setError(error); // Update the error state
      },
      onMutate: () => { // Callback before the mutation is executed
        setIsLoading(true); // Set the loading flag to true
        setError(null); // Clear any previous errors
      },
    }
  );

  // Update an existing workout
  const updateWorkout = useMutation(
    (updatedWorkout: Workout) => workoutService.updateWorkout(updatedWorkout), // The function to update the workout in the backend
    {
      onSuccess: (data, variables) => { // Callback when the mutation succeeds
        queryClient.invalidateQueries('workouts'); // Invalidate the 'workouts' cache to reflect the updated workout
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) => (workout.id === data.id ? data : workout)) // Update the workout in the state
        );
        setIsLoading(false); // Set the loading flag to false
        setError(null); // Clear any previous errors
      },
      onError: (error, variables) => { // Callback if an error occurs
        console.error('Error updating workout:', error); // Log the error
        setIsLoading(false); // Set the loading flag to false
        setError(error); // Update the error state
      },
      onMutate: () => { // Callback before the mutation is executed
        setIsLoading(true); // Set the loading flag to true
        setError(null); // Clear any previous errors
      },
    }
  );

  // Delete a workout
  const deleteWorkout = useMutation(
    (workoutId: string) => workoutService.deleteWorkout(workoutId), // The function to delete the workout in the backend
    {
      onSuccess: (_, variables) => { // Callback when the mutation succeeds
        queryClient.invalidateQueries('workouts'); // Invalidate the 'workouts' cache to reflect the deleted workout
        setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== variables)); // Remove the workout from the state
        setIsLoading(false); // Set the loading flag to false
        setError(null); // Clear any previous errors
      },
      onError: (error, variables) => { // Callback if an error occurs
        console.error('Error deleting workout:', error); // Log the error
        setIsLoading(false); // Set the loading flag to false
        setError(error); // Update the error state
      },
      onMutate: () => { // Callback before the mutation is executed
        setIsLoading(true); // Set the loading flag to true
        setError(null); // Clear any previous errors
      },
    }
  );

  // Fetch workouts initially on component mount
  useEffect(() => {
    fetchWorkouts();
  }, []);

  return { workouts, isLoading, error, fetchWorkouts, createWorkout, updateWorkout, deleteWorkout };
};

export default useWorkouts;