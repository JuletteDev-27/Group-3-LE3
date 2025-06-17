import React, { useState } from "react";
import { Box, TextField, Button, Typography, AppBar, Toolbar, Box as MuiBox, Button as MuiButton } from "@mui/material";

// ========== INLINE NAVBAR COMPONENT ==========
const Navbar = () => {
  return (
    <AppBar position="fixed" style={{ backgroundColor: "#2c2e61" }} sx={{ zIndex: 1200 }}>
      <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
        {/* Left-aligned buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" href="/User-HomePage">
            Home
          </Button>
          <Button color="inherit" href="/upload">
            Upload Post
          </Button>
          <Button color="inherit" href="/profile">
            Profile Settings
          </Button>
          <Button color="inherit" href="/User-RegisterPage">
            Log Out
          </Button>
        </Box>

        {/* Site Name on the right */}
        <Typography variant="h6" sx={{ color: "white" }}>
          Site Name
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle upload logic here
  };

  return (
    <>
      <Navbar />

      <MuiBox sx={{ pt: 8, p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Upload New Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Post Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            multiline
            rows={5}
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Post
          </Button>
        </form>
      </MuiBox>
    </>
  );
};

export default UploadPage;