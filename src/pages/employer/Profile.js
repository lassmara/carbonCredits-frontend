import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import axios from '../../axios';

const EmployerProfile = () => {
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/me');
        setEmployer(res.data);
      } catch (err) {
        console.error('Error fetching employer info', err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Employer Profile</Typography>
      {employer ? (
        <>
          <Typography><strong>Name:</strong> {employer.fullName}</Typography>
          <Typography><strong>Email:</strong> {employer.email}</Typography>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Paper>
  );
};

export default EmployerProfile;
