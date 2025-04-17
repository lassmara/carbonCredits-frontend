import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
  Alert,
  Stack,
  CircularProgress,
  Divider,
} from '@mui/material';
import axios from '../../axios';

const Wallet = () => {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('buy');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return setMessage({ type: 'error', text: 'Enter a valid number of points' });
    }

    if (mode === 'sell' && amount > user.points) {
      return setMessage({ type: 'error', text: 'You cannot sell more points than you have.' });
    }

    try {
      setLoading(true);
      await axios.post('/api/wallet', { action: mode, points: Number(amount) });

      const updatedPoints = mode === 'buy'
        ? user.points + Number(amount)
        : user.points - Number(amount);

      setUser({ ...user, points: updatedPoints });
      setAmount('');
      setMessage({ type: 'success', text: `Successfully ${mode === 'buy' ? 'bought' : 'sold'} ${amount} points.` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Transaction failed. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" gutterBottom>
          Wallet
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Welcome, <strong>{user.fullName}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Points: <strong>{user.points}</strong>
        </Typography>

        <Stack spacing={2} mt={3}>
          <ToggleButtonGroup
            fullWidth
            color="primary"
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && setMode(newMode)}
          >
            <ToggleButton value="buy">BUY</ToggleButton>
            <ToggleButton value="sell">SELL</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Carbon Credits"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            size="large"
          >
            {loading ? 'Processing...' : mode === 'buy' ? 'Buy Points' : 'Sell Points'}
          </Button>

          {message && (
            <Alert severity={message.type}>
              {message.text}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Wallet;
