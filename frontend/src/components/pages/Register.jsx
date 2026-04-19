import React, { useState } from 'react';
import { Button, Box, Alert, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextLine from '../commonUI/TextLine';
import { register } from '../../services/auth';

function Register () {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    if (!email || !name || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    // check the tow passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data } = await register({
        email, name, password
      });
      console.log('Registration successful:', data);
      navigate('/login');// drop tp login
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Failed to register');
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
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Register Account</Typography>
      <TextLine
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
      />
      <TextLine
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
      />
      <TextLine
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
      />
      <TextLine
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
      />
      <Button variant="contained" color="primary" onClick={handleRegister} sx={{ width: matches ? '80%' : '25%', maxWidth: 400, height: 45, mt: 2 }}>
        Register
      </Button>
      <Button variant="outlined" color="primary" onClick={() => navigate('/login')} sx={{ width: matches ? '80%' : '25%', maxWidth: 400, height: 45, mt: 2 }}>
        Back
      </Button>
    </Box>
  );
}

export default Register;
