import React, { useState } from 'react';
import { TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQueryClient } from 'react-query';

interface LoginFormProps {
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);

      if (isAuthenticated) {
        queryClient.invalidateQueries();
        navigate('/dashboard');
      } else {
        console.error('Login successful but isAuthenticated is false. Check authentication state.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
    }
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

export default LoginForm;