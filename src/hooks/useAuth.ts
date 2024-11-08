import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { User, AuthState, RegistrationResponse, AuthenticationError } from "../utils/types";
import { AuthService } from "../services/auth";
import { API_URL } from "../utils/constants";
import bcryptjs from 'bcryptjs';

const AuthContext = createContext<AuthState>({ token: null, user: null });

export const useAuth = (): AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: User) => Promise<void>;
  logout: () => void;
} => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({ token: null, user: null });
  const authService = new AuthService();

  const login = async (email: string, password: string) => {
    try {
      await authService.loginUser(email, password);
      const token = localStorage.getItem('token');

      if (token) {
        const userData = await authService.getUserData();
        if (userData) {
          setAuthState({ token: token, user: userData });
          queryClient.invalidateQueries();
        } else {
          console.error('Login successful but user data not found. Check user data retrieval.');
        }
      } else {
        console.error('Login successful but token not found. Check token retrieval.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new AuthenticationError(error.message);
    }
  };

  const register = async (userData: User) => {
    try {
      if (!validateEmail(userData.email)) {
        throw new Error('Invalid email format.');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      userData.password = await bcryptjs.hash(userData.password, 10); 

      const response = await authService.registerUser(userData);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new AuthenticationError(error.message);
    }
  };

  const logout = async () => {
    authService.logout();
    setAuthState({ token: null, user: null });
    queryClient.invalidateQueries();
  };

  const validateEmail = (email: string) => {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);