import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email.trim()) tempErrors.email = 'Email is required';
    if (!formData.password.trim()) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Login success:', formData);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 25 }}>
      <Paper sx={{ display: 'flex', minHeight: '500px' }}>
        {/* LEFT: Image */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Typography>Image or Illustration Here</Typography>
        </Box>

        {/* RIGHT: Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 4
          }}
        >
          <Typography variant="h3" gutterBottom>
            Site Name
          </Typography>

          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              marginLeft: 20,
              border: '1px solid gray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <Typography>Logo</Typography>
          </Box>

          <Box component="form" noValidate onSubmit={handleLogin}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#4A9DAE',
                padding: '8px 12px',
                '&:hover': {
                  backgroundColor: '#A0E1EA'
                }
              }}
            >
              Log In / Sign In
            </Button>

            <Button
              variant="contained"
              
              sx={{
                mt: 0, marginLeft: 1,
                backgroundColor: '#4A9DAE',
                padding: '8px 12px',
                '&:hover': {
                  backgroundColor: '#A0E1EA'
                }
              }}
              onClick={() => navigate('/register')}
            >
              Register
          </Button>

          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LandingPage;
