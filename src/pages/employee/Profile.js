import React, { useEffect, useState } from 'react';
import { Box, Paper, Avatar, Typography, CircularProgress, Stack } from '@mui/material';
import axios from '../../axios';

const EmployeeProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <main>
      <Box>
        <Paper elevation={2} sx={{ borderRadius: 2, p: 4 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 56, height: 56 }}>{user?.fullName?.charAt(0).toUpperCase()}</Avatar>
                <Typography variant="h5" fontWeight="bold">Employee Profile</Typography>
              </Box>
              <Typography><strong>Name:</strong> {user.fullName}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Employer:</strong> {user.employerName}</Typography>
              <Typography><strong>Total Points:</strong> {user.points}</Typography>
            </Stack>
          )}
        </Paper>
      </Box>
    </main>
  );
};

export default EmployeeProfile;
