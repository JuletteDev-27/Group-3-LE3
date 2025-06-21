import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { email, firstName, lastName, password, confirmPassword } = formData;

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    params.append('email', email)
    params.append('fName', firstName)
    params.append('lName', lastName)
    params.append('password', password)    

    try {
      setLoading(true);
      await axios.post('https://supabase-socmed.vercel.app/register', params , {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "grid", height: "100svh", backgroundColor:"#B09E7D", position:"relative" }}>
      <Typography variant="h2" sx={{ position:"absolute", top:0, right:0, padding: 7, fontWeight:"900", color:"#0B1657"}}>EchoNote</Typography>
        <Box sx={{ maxWidth: 500, mx: 'auto', px: 3, py: 4, borderRadius: 2,  placeSelf: 'center', }}>
        <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}  > 
            <Grid item size={{xs: 12}}>
                <TextField
                fullWidth
                variant='filled'
                sx={{ backgroundColor:"#E6D8C7" }}
                color={"#B09E7D"}
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                />
            </Grid>
            <Grid item size={{ xs: 12 }}>
                <TextField
                sx={{ backgroundColor:"#E6D8C7" }}
                color={"#B09E7D"}
                variant='filled'
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                />
            </Grid>
            <Grid item size={{ lg: 12, xs: 12 }}>
                <TextField
                sx={{ backgroundColor:"#E6D8C7" }}
                color={"#B09E7D"}
                variant='filled'
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </Grid>
            <Grid item size={{ lg:6, xs: 12 }}>
                <TextField
                sx={{ backgroundColor:"#E6D8C7" }}
                color={"#B09E7D"}
                variant='filled'
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label="toggle password visibility"
                        >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                />
            </Grid>
            <Grid item size={{ lg:6, xs: 12 }}>
                <TextField
                sx={{ backgroundColor:"#E6D8C7" }}
                color={"#B09E7D"}
                variant='filled'
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                        >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                />
            </Grid>
            </Grid>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, backgroundColor:"#0B1657" }}
            disabled={loading}

            >
            {loading ? 'Processing...' : 'Register'}
            </Button>
            <Button fullWidth variant="contained" color="primary" sx={{ mt:3 }} onClick={()=>{
              navigate("/")
            }}>
              Return Home
            </Button>
        </form>
        </Box>
    </Box>
    
  );
};

export default RegisterPage;
 


