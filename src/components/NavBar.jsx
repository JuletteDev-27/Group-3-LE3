import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logOut } from './sessionTimeoutHandler';

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogOut = () =>{
    logOut(navigate)
  }

  return (
    <AppBar position="sticky" sx={{ zIndex: 1200, backgroundColor: '#1976d2', top:0, left:0 , margin:0}}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" sx={{ textTransform: 'none' }} onClick={()=>{
            navigate("/User-HomePage")
          }}>HOME</Button>
          <Button color="inherit" sx={{ textTransform: 'none' }}>UPLOAD POST</Button>
          <Button color="inherit" sx={{ textTransform: 'none' }} onClick={()=>{
            navigate("/User-Profile")
          }}>PROFILE SETTINGS</Button>
          <Button color="inherit" sx={{ textTransform: 'none' }} onClick={handleLogOut}>LOG OUT</Button>
        </Box>
        <Typography variant="h6">Site Name</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;