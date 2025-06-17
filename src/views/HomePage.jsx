import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  List,
  ListItem,
  Divider,
  Button,
  IconButton,
  ListItemText,
  AppBar,
  Toolbar,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import "../assets/css/HomePage.css";

// ========== INLINE NAVBAR COMPONENT ==========
// ========== INLINE NAVBAR COMPONENT WITH LINKS ==========
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

// ========== MAIN HOMEPAGE COMPONENT ==========
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [reactions, setReactions] = useState({});
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    const mockPosts = [
      { id: 1, title: "Post One", content: "Life is short, and the world is wide. Let's go explore!" },
      { id: 2, title: "Post Two", content: "Just got back from another trip, and wow... this was truly one for the books! Easily the best five days of my life. Already counting down the days until the next adventure." },
    ];
    setPosts(mockPosts);
    setSelectedPostId(mockPosts[0].id);
  }, []);

  useEffect(() => {
    if (!selectedPostId) return;

    const mockReplies = {
      1: [
        { id: 101, content: "Wow! Where is this located?", username: "commenter_1", timestamp: "June 15, 2025" },
        { id: 102, content: "Nice pictures!", username: "commenter_2", timestamp: "June 15, 2025" },
        { id: 103, content: "Love this <3", username: "commenter_3", timestamp: "June 16, 2025" },
      ],
      2: [{ id: 201, content: "Comment 1 on Post 2" }],
    };

    setComments(mockReplies[selectedPostId] || []);
    setReactions((prev) => ({
      ...prev,
      [selectedPostId]: prev[selectedPostId] || { likes: 0, dislikes: 0 },
    }));
  }, [selectedPostId]);

  const handleCommentKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = newComment.trim();
      if (!trimmed) return;

      const newReply = {
        id: Date.now(),
        content: trimmed,
        username: "Your Username",
        timestamp: new Date().toLocaleDateString(),
      };
      setComments((prev) => [...prev, newReply]);
      setNewComment("");
    }
  };

  const toggleReaction = (type) => {
    const current = userReactions[selectedPostId];
    const newReaction = current === type ? null : type;

    setUserReactions((prev) => ({ ...prev, [selectedPostId]: newReaction }));

    setReactions((prev) => {
      const prevLikes = prev[selectedPostId]?.likes || 0;
      const prevDislikes = prev[selectedPostId]?.dislikes || 0;

      let newLikes = prevLikes;
      let newDislikes = prevDislikes;

      if (type === "like") {
        newLikes += current === "like" ? -1 : 1;
        if (current === "dislike") newDislikes -= 1;
      } else {
        newDislikes += current === "dislike" ? -1 : 1;
        if (current === "like") newLikes -= 1;
      }

      return {
        ...prev,
        [selectedPostId]: { likes: newLikes, dislikes: newDislikes },
      };
    });
  };

  const handleDeleteComment = (replyId) => {
    setComments((prev) => prev.filter((c) => c.id !== replyId));
  };

  return (
    <>
      {/* ========== RENDER INLINE NAVBAR ========== */}
      <Navbar />
  <Toolbar />
      {/* ========== MAIN CONTENT ========== */}
      <Box
        sx={{

          height: "100vh",
          display: "grid",
          gridTemplateColumns: "250px 1fr 300px",
          gap: "1rem",
          p: "1rem",
          backgroundColor: "#bca47d",
        }}
      >
        {/* Sidebar */}
        <Box className="sidebar">
          <List>
            {posts.map((p) => (
              <ListItem
                key={p.id}
                button
                selected={p.id === selectedPostId}
                onClick={() => setSelectedPostId(p.id)}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "#1565C0" },
                  "&.Mui-selected": { backgroundColor: "#0D47A1" },
                }}
              >
                <ListItemText primary={`Post #${p.id}`} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            <Avatar alt="User Avatar" src="https://source.unsplash.com/random/100x100/?avatar" sx={{ width: 80, height: 80, mx: "auto" }} />
            <Typography sx={{ mt: 1, fontStyle: "italic" }}>@username</Typography>
          </Box>
        </Box>

        {/* Post Content */}
        <Box className="post-card">
          <Typography variant="h5" sx={{ mb: 2 }}>
            {posts.find((p) => p.id === selectedPostId)?.content || "[No Post Selected]"}
          </Typography>
          <Box sx={{ display: "flex", gap: "1rem", mt: 2 }}>
            <img src="https://source.unsplash.com/random/300x200/?travel" alt="Image 1" style={{ width: "48%", height: "auto", borderRadius: "12px" }} />
            <img src="https://source.unsplash.com/random/300x200/?landscape" alt="Image 2" style={{ width: "48%", height: "auto", borderRadius: "12px" }} />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, fontStyle: "italic" }}>
            Posted on June 15, 2025
          </Typography>
        </Box>

        {/* Comments & Reactions */}
        <Box className="comment-panel">
          {/* Comment Input */}
          <TextField
            label="Write a comment..."
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleCommentKeyDown}
            sx={{
              border: "2px solid #2c2e61", 
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#2c2e61" } },
            }}
          />

          {/* Comments List */}
          <List sx={{ flex: 1, overflowY: "auto", maxHeight: "400px" }}>
            {comments.map((c) => (
              <React.Fragment key={c.id}>
                <ListItem alignItems="flex-start" sx={{ flexDirection: "column", p: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar alt="Commenter Avatar" src="https://source.unsplash.com/random/40x40/?avatar" sx={{ width: 40, height: 40, mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                          {c.username}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "gray" }}>
                          Posted on {c.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteComment(c.id)}
                      sx={{
                        background: "#f6e8d2", 
                        border: "1px solid #c9a16c",
                        color: "#333",
                        borderRadius: "8px",
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {c.content}
                  </Typography>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          {/* Reaction Buttons */}
          <Box className="reaction-buttons">
            <Button
              onClick={() => toggleReaction("like")}
              sx={{
                background: "white",
                color: "#1c2654",
                border: "none",
                borderRadius: "12px",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Like
            </Button>
            <Typography sx={{ ml: 1, fontWeight: "bold" }}>
              {reactions[selectedPostId]?.likes || 0}
            </Typography>
            <Button
              onClick={() => toggleReaction("dislike")}
              sx={{
                background: "white",
                color: "#aa0000",
                border: "none",
                borderRadius: "12px",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Dislike
            </Button>
            <Typography sx={{ ml: 1, fontWeight: "bold" }}>
              {reactions[selectedPostId]?.dislikes || 0}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;