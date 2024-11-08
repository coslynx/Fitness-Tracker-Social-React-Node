import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQueryClient } from 'react-query';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);

      if (isAuthenticated) {
        queryClient.invalidateQueries();
        navigate('/dashboard');
      } else {
        setError('Login successful but isAuthenticated is false. Check authentication state.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />

        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleLogin}
          fullWidth
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {isLoading && <CircularProgress sx={{ mt: 2 }} />}
    </div>
  );
};

export default LoginPage;