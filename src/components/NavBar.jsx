import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logOut } from './sessionTimeoutHandler';

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogOut = () =>{
    logOut(navigate)
  }

  return (
    <AppBar position="sticky" sx={{ zIndex: 1200, backgroundColor: '#E6D8C7', top:0, left:0 , margin:0}}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" variant='contained' sx={{ textTransform: 'none', backgroundColor:"white", color:"#0B1657",borderColor:"#0B1657", borderWidth:3, borderStyle: "solid" }} onClick={()=>{
            navigate("/User-HomePage")
          }}>HOME</Button>
          <Button color="inherit" variant='contained' sx={{ textTransform: 'none', backgroundColor:"white", color:"#0B1657",borderColor:"#0B1657", borderWidth:3, borderStyle: "solid" }} onClick={()=>{
            navigate("/User-Profile")
          }}>PROFILE SETTINGS</Button>
          <Button color="inherit" variant='contained' sx={{ textTransform: 'none', backgroundColor:"white", color:"#0B1657",borderColor:"#0B1657", borderWidth:3  , borderStyle: "solid" }} onClick={handleLogOut}>LOG OUT</Button>
        </Box>
         <Typography variant="h4" sx={{padding: 1, fontWeight:"900", color:"#0B1657"}}>EchoNote</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;