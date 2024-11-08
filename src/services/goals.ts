import axios from 'axios';
import jwt from 'jsonwebtoken';
import { API_URL, JWT_SECRET } from '../utils/constants';
import { Goal } from '../utils/types';

interface GoalServiceProps {
  token: string;
}

class GoalService {
  private token: string;

  constructor(props: GoalServiceProps) {
    this.token = props.token;
  }

  async createGoal(goal: Goal): Promise<Goal> {
    try {
      const response = await axios.post<Goal>(`${API_URL}/goals`, goal, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  async getGoals(): Promise<Goal[]> {
    try {
      const response = await axios.get<Goal[]>(`${API_URL}/goals`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  async updateGoal(goal: Goal): Promise<Goal> {
    try {
      const response = await axios.put<Goal>(
        `${API_URL}/goals/${goal.id}`,
        goal,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  async deleteGoal(goalId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }
}

const goalService = new GoalService({
  token: localStorage.getItem('token') || '',
});

export default goalService;