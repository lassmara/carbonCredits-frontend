import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,Divider,
} from '@mui/material';
import axios from '../axios';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [mode, setMode] = useState('car');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/auth/me');
        setUser(userRes.data);
        fetchRequests();
      } catch (err) {
        console.error('Error fetching user or requests', err);
      }
    };
    fetchData();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/requests/employee');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests', err);
    }
  };

  const sendRequest = async () => {
    try {
      await axios.post('/api/requests', { mode });
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error('Error submitting request', err);
      alert('Submission failed');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await axios.delete(`/api/requests/${id}`);
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error('Error dismissing request', err);
    }
  };

  return user ? (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {user.fullName}
        </Typography>
        <Typography variant="subtitle1">
          Employer: <strong>{user.employerName || 'N/A'}</strong>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Total Points: {user.points}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          New Carbon Credit Request
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <Select
            value={mode}
            onChange={e => setMode(e.target.value)}
            fullWidth
          >
            <MenuItem value="car">Car (10 pts)</MenuItem>
            <MenuItem value="bus">Bus (20 pts)</MenuItem>
            <MenuItem value="bike">Bike (30 pts)</MenuItem>
          </Select>
          <Button variant="contained" onClick={sendRequest}>
            Submit
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Your Requests
          </Typography>
          {requests.length > 0 ? (
            <List>
              {requests.map(req => (
                <ListItem key={req._id} divider>
                  <ListItemText
                    primary={`${req.mode.toUpperCase()} - ${req.points} pts`}
                    secondary={`Status: ${req.status}`}
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
          ) : (
            <Typography>No requests submitted yet.</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  ) : (
    <Typography variant="h6" sx={{ mt: 5, textAlign: 'center' }}>
      Loading...
    </Typography>
  );
};

export default EmployeeDashboard;
