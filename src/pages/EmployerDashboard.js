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
} from '@mui/material';
import axios from '../axios';

const EmployerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    fetchEmployer();
    fetchRequests();
  }, []);

  const fetchEmployer = async () => {
    try {
      const res = await axios.get('/auth/me');
      setEmployer(res.data);
    } catch (err) {
      console.error('Error fetching employer info:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/requests/employer');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axios.put(`/api/requests/${id}`, { status });
      fetchRequests();
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

        {employer && (
          <Typography variant="subtitle1" align="center" gutterBottom>
            Logged in as: <strong>{employer.fullName}</strong>
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Pending Carbon Credit Requests
        </Typography>

        {requests.length === 0 ? (
          <Typography>No pending requests.</Typography>
        ) : (
          <List>
            {requests.map(req => (
              <ListItem key={req._id} divider alignItems="flex-start" sx={{ py: 2 }}>
                <ListItemText
                  primary={`${req.mode.toUpperCase()} - ${req.points} pts`}
                  secondary={`From: ${req.employeeId.fullName} | Status: ${req.status}`}
                />
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
