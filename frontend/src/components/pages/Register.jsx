import React, { useState } from 'react';
import { Button, Box, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextLine from '../commonUI/TextLine';

function Register () {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    // 检查所有输入是否已填写
    if (!email || !name || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    // 检查密码是否匹配
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful:', data);
        navigate('/Dashboard');// 注册成功后跳转到登录页面
      } else {
        setError(data.error || 'Failed to register');
      }
    } catch (error) {
      setError('Network error, please try again later.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      {error && <Alert severity="error" style={{ width: '100%', marginBottom: 20 }}>{error}</Alert>}
      <Typography variant="h5" component="h2" style={{ marginBottom: 20 }}>Register Account</Typography>
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
      <Button variant="contained" color="primary" onClick={handleRegister} style={{ width: '25%', maxWidth: 400, height: 45, marginTop: 20 }}>
        Register
      </Button>
      <Button variant="outlined" color="primary" onClick={() => navigate('/login')} style={{ width: '25%', maxWidth: 400, height: 45, marginTop: 20 }}>
        Back
      </Button>
    </Box>
  );
}

export default Register;
