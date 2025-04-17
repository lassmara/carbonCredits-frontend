import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Box, Toolbar } from '@mui/material';
import axios from '../axios';
import { Outlet } from 'react-router-dom';

const EmployerLayout = () => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get('/api/requests/employer');
        setPendingCount(res.data.length);
      } catch (err) {
        console.error('Error loading pending count', err);
      }
    };
    fetchPending();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar isEmployer={true} pendingCount={pendingCount} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '240px' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmployerLayout;
