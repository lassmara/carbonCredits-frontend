import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import axios from '../axios';

const EmployerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true); // Loading indicator

  useEffect(() => {
    fetchEmployer();
    fetchRequests();
  }, []);

  // Fetch employer details
  const fetchEmployer = async () => {
    try {
      const res = await axios.get('/auth/me');
      setEmployer(res.data);
    } catch (err) {
      console.error('Error fetching employer info:', err);
    }
  };

  // Fetch pending requests from employees
  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/requests/employer');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // Handle approve/reject actions for requests
  const handleAction = async (id, status) => {
    try {
      await axios.put(`/api/requests/${id}`, { status });
      fetchRequests(); // Refresh the list after action
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Employer Dashboard
        </Typography>

        {/* Display Employer Name */}
        {employer && (
          <Typography variant="subtitle1" align="center" gutterBottom>
            Logged in as: <strong>{employer.fullName}</strong>
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Pending Carbon Credit Requests
        </Typography>

        {/* Show loading indicator while fetching requests */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : requests.length === 0 ? (
          <Typography>No pending requests.</Typography>
        ) : (
          <List>
            {requests.map((req) => (
              <ListItem key={req._id} divider alignItems="flex-start" sx={{ py: 2 }}>
                <ListItemText
                  primary={`${req.mode.toUpperCase()} - ${req.points} pts`}
                  secondary={`From: ${req.employeeId.fullName} | Status: ${req.status}`}
                />
                {/* Display Employee Location */}
                <Typography variant="body2" color="textSecondary">
                  Location: {req.location.coordinates ? `${req.location.coordinates[0]}, ${req.location.coordinates[1]}` : 'Not available'}
                </Typography>
                <ListItemSecondaryAction>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAction(req._id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleAction(req._id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default EmployerDashboard;
