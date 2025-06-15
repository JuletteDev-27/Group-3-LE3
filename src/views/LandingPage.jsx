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
    <Container maxWidth="xl" disableGutters sx={{ minHeight: '100vh' }}>
      <Paper sx={{ display: 'flex', minHeight: '100vh', boxShadow: 'none' /* No shadow for full page effect */ }}> 
        {/* LEFT: Image Section with space around */}
        <Box
          sx={{
            flex: 1,
            p: 15, // Outer padding around the image
          }}
        >
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              borderRadius: 5
            }}
          >
            <Container
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/path-to-your-image.png"  // replace with your image path
                alt="Illustration"
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
              />
            </Container>
          </Box>
        </Box>

        {/* RIGHT: Form Section with padding around */}
        <Box sx={{ flex: 1, p: 5 }}>
          <Box
            sx={{
              borderRadius: 5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 4
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'right', mb: 6 }}>
              Site Name
            </Typography>

            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                padding: 3,
                border: '1px solid gray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 7,
                ml: '20%' // aligns the logo circle 
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
                  mt: 2,
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
                  mt: 2,
                  ml: 1,
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
        </Box>
      </Paper>
    </Container>
  );
};

export default LandingPage;
