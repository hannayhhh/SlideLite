import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard () {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 获取存储的token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:5005/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`// 发送token到后端
          },
        });

        if (response.ok) {
          console.log('Logout successful');
        } else {
          console.error('Logout failed', await response.json());
        }
      } catch (error) {
        console.error('Network error or logout failed', error);
      }
    }

    localStorage.removeItem('token');// 清除本地存储的token
    navigate('/login');// 重定向回登录页面
  };

  return (
    <Box display="flex" justifyContent="flex-end" p={1}>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}

export default Dashboard;
