import React, { useState } from 'react';
import { Button, Box, Alert, Typography, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextLine from '../commonUI/TextLine';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    setError('');
    if (!email) {
      setError('Please enter your email');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/login', {
        email,
        password
      });

      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Failed to login');
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError('Error setting up the request');
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Log in here</Typography>
      <TextLine
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      <TextLine
        label="Password"
        value={password}
        type={showPassword ? 'text' : 'password'}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Button variant="contained" color="primary" onClick={handleLogin} sx={{ width: '25%', maxWidth: 400, height: 45, mt: 2 }}>
        Login
      </Button>
      <Button variant="outlined" color="primary" onClick={() => navigate('/register')} sx={{ width: '25%', maxWidth: 400, height: 45, mt: 2 }}>
        Register
      </Button>
    </Box>
  );
}

export default Login;
