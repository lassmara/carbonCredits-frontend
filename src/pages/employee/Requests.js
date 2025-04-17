import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import axios from '../../axios';

const EmployeeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/requests/employee');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching employee requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await axios.delete(`/api/requests/${id}`);
      fetchRequests();
    } catch (err) {
      console.error('Error dismissing request:', err);
    }
  };

  return (
    <main>
      <Paper elevation={2} sx={{ borderRadius: 2, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          My Requests
        </Typography>

        <Divider sx={{ my: 2 }} />

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : requests.length === 0 ? (
          <Typography>No requests submitted yet.</Typography>
        ) : (
          <List>
            {requests.map((req) => (
              <ListItem key={req._id} divider alignItems="flex-start">
                <ListItemText
                  primary={`${req.mode.toUpperCase()} - ${req.points} pts`}
                  secondary={
                    <>
                      <Typography variant="body2">Distance: {req.distance} km</Typography>
                      <Typography variant="body2">Status: {req.status}</Typography>
                      <Typography variant="body2">Submitted on: {new Date(req.createdAt).toLocaleString()}</Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={req.status === 'approved'}
                    onClick={() => handleDismiss(req._id)}
                  >
                    Dismiss
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </main>
  );
};

export default EmployeeRequests;
