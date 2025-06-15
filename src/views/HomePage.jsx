import React from 'react';
import Navbar from '../components/NavBar';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';

const HomePage = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ flex: 1, display: 'flex', pt: 8 }}>
        <Box
          sx={{
            width: '20%',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #ccc',
            p: 2,
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 1,
              mb: 2,
            }}
          >
            <Typography align="center">Post Scroll bar</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto' }} />
            <Typography sx={{ mt: 1 }}>text-username</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ fontSize: '2rem' }}
            >
              [Placeholder] Post Content
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: '25%',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            borderLeft: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        >
          <TextField
            label="Write a comment"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
          <Box sx={{ mt: 2, flex: 1, overflowY: 'auto' }}>
            <TextField
              label="Comments"
              fullWidth
              multiline
              rows={5}
              variant="outlined"
            />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" fullWidth>
              LIKE
            </Button>
            <Button variant="contained" color="error" fullWidth>
              DISLIKE
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;