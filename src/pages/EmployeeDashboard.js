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
  Box,
  Divider
} from '@mui/material';
import axios from '../axios';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [mode, setMode] = useState('car');
  const [distance, setDistance] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/auth/me');
        setUser(userRes.data);
        fetchRequests();
      } catch (err) {
        console.error('Error fetching user or requests:', err);
      }
    };
    fetchData();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/requests/employee');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const sendRequest = async () => {
    if (!distance || !location) {
      alert('Please provide distance and location.');
      return;
    }

    try {
      await axios.post('/api/requests', {
        mode,
        distance: Number(distance),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
      setDistance('');
      setLocation(null);
      fetchRequests();
    } catch (err) {
      console.error('Error submitting request', err);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          alert('Location access denied.');
        }
      );
    } else {
      alert('Geolocation not supported');
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

  return user ? (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {user.fullName}
        </Typography>
        <Typography variant="subtitle1">Employer: <strong>{user.employerName}</strong></Typography>
        <Typography variant="subtitle1" gutterBottom>Total Points: {user.points}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">New Carbon Credit Request</Typography>
        <Box display="flex" gap={2} mb={2}>
          <Select value={mode} onChange={e => setMode(e.target.value)} fullWidth>
            <MenuItem value="car">Car (10 pts/mile)</MenuItem>
            <MenuItem value="bus">Bus (20 pts/mile)</MenuItem>
            <MenuItem value="bike">Bike (30 pts/mile)</MenuItem>
          </Select>
          <Button variant="contained" onClick={sendRequest}>Submit</Button>
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <input
            type="number"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            placeholder="Distance (miles)"
            style={{ flex: 1 }}
          />
          <Button onClick={getLocation} variant="outlined">Get Location</Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Your Requests</Typography>
        {requests.length > 0 ? (
          <List>
            {requests.map(req => (
              <ListItem key={req._id} divider>
                <ListItemText
                  primary={`${req.mode.toUpperCase()} - ${req.points} pts`}
                  secondary={`Distance: ${req.distance} miles | Status: ${req.status}`}
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
      </Paper>
    </Container>
  ) : (
    <Typography sx={{ mt: 5, textAlign: 'center' }}>Loading...</Typography>
  );
};

export default EmployeeDashboard;
