import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Toolbar,
  Typography,
  AppBar,
  CircularProgress,
  IconButton,
  Avatar,
  Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from '../axios';
import { Outlet, useNavigate } from 'react-router-dom';

const EmployeeLayout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('User not logged in. Redirecting...');
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout'); // or clear token
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (!user) {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar isEmployer={false} />

      <Box sx={{ flexGrow: 1 }}>
        {/* Top App Bar */}
        <AppBar
          position="static"
          color="inherit"
          elevation={1}
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3 }}
        >
          <Typography variant="h6">
            Welcome, <strong>{user.fullName}</strong> — Points: <strong>{user.points}</strong>
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Avatar>{user.fullName[0]}</Avatar>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </AppBar>

        {/* Page Content */}
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
          <Outlet context={{ user }} />
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
