import axios from 'axios';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../utils/types';
import { API_URL, JWT_SECRET } from '../utils/constants';

export class AuthService {
  async registerUser(userData: User): Promise<void> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcryptjs.hash(userData.password, saltRounds);
      await axios.post(`${API_URL}/auth/register`, {
        ...userData,
        password: hashedPassword,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      jwt.verify(token, JWT_SECRET);

      const response = await axios.get(`${API_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Get user data error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}