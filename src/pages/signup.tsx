import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { User } from '../utils/types';
import { API_URL } from '../utils/constants';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { register } = useAuth();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const userData: User = { email, password };
      await register(userData);
      router.push('/login'); 
      setIsLoading(false); 
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>
      <form onSubmit={handleSubmit}>
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
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
        />
        <Button
          variant="contained"
          disabled={isLoading}
          type="submit"
          fullWidth
        >
          {isLoading ? 'Signing up...' : 'Signup'}
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

export default SignupPage;