import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const LoginPage = () => {
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ role: 'employee' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', form);
      const role = res.data.role;
      setTimeout(() => {
        navigate(role === 'employee' ? '/dashboard/employee' : '/dashboard/employer');
      }, 200);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('/auth/register', form);
      alert('Registration successful. Now login.');
      setIsNew(false);
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  // ✅ Google OAuth Redirect Handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'notregistered') {
      alert('This email is not registered. Please register to continue.');

      const emailFromURL = params.get('email');
      if (emailFromURL) {
        setForm(prev => ({ ...prev, email: emailFromURL }));
        setIsNew(true);
      }
    }
  }, []);

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {isNew ? 'Register' : 'Login'}
        </Typography>

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={form.email || ''}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        {isNew && (
          <>
            <TextField
              label="Full Name"
              name="fullName"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              label="Role"
              name="role"
              select
              fullWidth
              margin="normal"
              value={form.role}
              onChange={handleChange}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="employer">Employer</MenuItem>
            </TextField>
            {form.role === 'employee' && (
              <TextField
                label="Employer Name"
                name="employerName"
                fullWidth
                margin="normal"
                onChange={handleChange}
              />
            )}
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={isNew ? handleRegister : handleLogin}
        >
          {isNew ? 'Register' : 'Login'}
        </Button>

        {!isNew && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              window.location.href = 'http://localhost:5000/auth/google';
            }}
          >
            Login with Google
          </Button>
        )}

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            {isNew ? 'Already have an account?' : 'New user?'}{' '}
            <Link component="button" variant="body2" onClick={() => setIsNew(!isNew)}>
              {isNew ? 'Login here' : 'Register here'}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
