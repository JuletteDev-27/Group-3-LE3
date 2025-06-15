
import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1200, backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" sx={{ textTransform: 'none' }}>HOME</Button>
          <Button color="inherit" sx={{ textTransform: 'none' }}>UPLOAD POST</Button>
          <Button color="inherit" sx={{ textTransform: 'none' }}>PROFILE SETTINGS</Button>
          <Button color="inherit" sx={{ textTransform: 'none' }}>LOG OUT</Button>
        </Box>
        <Typography variant="h6">Site Name</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;