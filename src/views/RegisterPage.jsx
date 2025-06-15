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

const RegisterPage = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.firstName.trim()) tempErrors.firstName = 'First name is required';
    if (!formData.email.trim()) tempErrors.email = 'Email is required';
    if (!formData.password.trim()) tempErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (onNext) onNext(formData);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper className="register-paper">
        <Typography variant="h5" gutterBottom>
          Register Account
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                required
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>

          <TextField
            className="register-field"
            name="email"
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mt: 2 }}
          />
          <TextField
            className="register-field"
            name="password"
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mt: 2 }}
          />
          <TextField
            className="register-field"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            className="register-button"
            sx={{
              mt: 5,
              backgroundColor: '#4A9DAE',
              padding: '5px 12px',
              '&:hover': {
                backgroundColor: '#A0E1EA'
              }
            }}
          >
            Register 
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
