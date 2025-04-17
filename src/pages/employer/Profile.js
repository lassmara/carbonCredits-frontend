import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Avatar,
  Stack,
  CircularProgress,
} from '@mui/material';
import axios from '../../axios';

const EmployerProfile = () => {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/me');
        setEmployer(res.data);
      } catch (err) {
        console.error('Error fetching employer info', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <main>
      <Box >
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            p: { xs: 3, sm: 4 },
          }}
        >
          <Box className="MuiStack-root css-1sazv7p-MuiStack-root">
            {loading ? (
              <Box  minHeight="120px">
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {employer?.fullName?.charAt(0).toUpperCase() || '?'}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Employer Profile
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1"><strong>Name:</strong> {employer.fullName}</Typography>
                  <Typography variant="body1"><strong>Email:</strong> {employer.email}</Typography>
                </Box>
              </Stack>
            )}
          </Box>
        </Paper>
      </Box>
    </main>
  );
};

export default EmployerProfile;
