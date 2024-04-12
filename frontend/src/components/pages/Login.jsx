import React, { useState } from 'react';
import { Button, Box, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextLine from '../commonUI/TextLine';

function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(''); // 清除旧的错误信息
    if (!email) {
      setError('Please enter your email');
      return;
    }
    try {
      const response = await fetch('http://localhost:5005/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // 登录成功
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);// 保存token
        navigate('/Dashboard');// 跳转到dashboard
      } else {
        // 登录失败
        setError(data.error || 'Failed to login');
      }
    } catch (error) {
      // 网络或其他错误处理
      setError('Network error, please try again later.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      {error && <Alert severity="error" style={{ width: '100%', marginBottom: 20 }}>{error}</Alert>}
      <Typography variant="h5" component="h2" style={{ marginBottom: 20 }}>Log in here</Typography>
      <TextLine
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      <TextLine
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      <Button variant="contained" color="primary" onClick={handleLogin} style={{ width: '25%', maxWidth: 400, height: 45, marginTop: 20 }}>
        Login
      </Button>
      <Button variant="contained" color="primary" onClick={() => navigate('/register')} style={{ width: '25%', maxWidth: 400, height: 45, marginTop: 20 }}>
        Register
      </Button>
    </Box>
  );
}

export default Login;
