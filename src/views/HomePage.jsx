import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const mockPosts = [
  { id: 1, title: "Post One", content: "This is the content of post one." },
  { id: 2, title: "Post Two", content: "Second post is more insightful." },
  { id: 3, title: "Post Three", content: "Here’s a cool update from Post 3!" },
  { id: 4, title: "Post Four", content: "Fourth post with great advice." },
  { id: 5, title: "Post Five", content: "Fifth post with community news." },
  { id: 6, title: "Post Six", content: "Last post to round things off." },
];

const mockComments = [
  { postId: 1, content: "Awesome post!" },
  { postId: 1, content: "Really helpful." },
  { postId: 2, content: "Thanks for sharing." },
  { postId: 3, content: "Interesting perspective!" },
  { postId: 4, content: "I agree completely." },
  { postId: 5, content: "Let’s talk more about this." },
  { postId: 6, content: "Well written!" },
];

const HomePage = () => {
  const [posts] = useState(mockPosts);
  const [comments, setComments] = useState(mockComments);
  const [selectedPostId, setSelectedPostId] = useState(mockPosts[0].id);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const token = "YOUR_BEARER_TOKEN";

  const handleCommentKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && newComment.trim()) {
      const updated = [...comments, { postId: selectedPostId, content: newComment.trim() }];
      setComments(updated);
      setNewComment("");
      e.preventDefault();
    }
  };

  const toggleLike = async () => {
  if (!selectedPostId) return;

  const hasLiked = userReactions[selectedPostId] === "like";
  const hasDisliked = userReactions[selectedPostId] === "dislike";

  try {
    const method = hasLiked ? "DELETE" : "POST";
    const res = await fetch(`/post/${selectedPostId}/likes`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 204) {
      setUserReactions((prev) => ({
        ...prev,
        [selectedPostId]: hasLiked ? null : "like",
      }));

      setLikes((prev) => ({
        ...prev,
        [selectedPostId]: hasLiked ? (prev[selectedPostId] || 1) - 1 : (prev[selectedPostId] || 0) + 1,
      }));

      if (!hasLiked && hasDisliked) {
        setDislikes((prev) => ({
          ...prev,
          [selectedPostId]: (prev[selectedPostId] || 1) - 1,
        }));
      }
    } else if (res.status === 409 && !hasLiked) {
      console.warn("Already liked");
    }
  } catch (err) {
    console.error("Like API error:", err);
  }
};


  const toggleDislike = () => {
  const hasDisliked = userReactions[selectedPostId] === "dislike";
  const hasLiked = userReactions[selectedPostId] === "like";

  setUserReactions((prev) => ({
    ...prev,
    [selectedPostId]: hasDisliked ? null : "dislike",
  }));

  setDislikes((prev) => ({
    ...prev,
    [selectedPostId]: hasDisliked ? (prev[selectedPostId] || 1) - 1 : (prev[selectedPostId] || 0) + 1,
  }));

  if (!hasDisliked && hasLiked) {
    setLikes((prev) => ({
      ...prev,
      [selectedPostId]: (prev[selectedPostId] || 1) - 1,
    }));
  }
};


  const handleDeleteComment = (indexToDelete) => {
    const updated = comments.filter((c, i) => !(c.postId === selectedPostId && i === indexToDelete));
    setComments(updated);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ flex: 1, display: "flex", pt: 8 }}>
        {/* Sidebar: Post List */}
        <Box
          sx={{
            width: "20%",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #ccc",
            p: 2,
            boxSizing: "border-box",
          }}
        >
          <List>
            {posts.map((post) => (
              <ListItem
                key={post.id}
                button
                selected={post.id === selectedPostId}
                onClick={() => setSelectedPostId(post.id)}
              >
                <ListItemText primary={post.title} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Avatar sx={{ width: 80, height: 80, mx: "auto" }} />
            <Typography sx={{ mt: 1 }}>text-username</Typography>
          </Box>
        </Box>

        {/* Main: Post Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ fontSize: "2rem" }}
            >
              {posts.find((p) => p.id === selectedPostId)?.content || "[No Post Selected]"}
            </Typography>
          </Box>
        </Box>

        {/* Comments */}
        <Box
          sx={{
            width: "25%",
            display: "flex",
            flexDirection: "column",
            p: 2,
            borderLeft: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        >
          <TextField
            label="Write a comment"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleCommentKeyDown}
          />

          <Box sx={{ mt: 2, flex: 1, overflowY: "auto" }}>
            <List>
              {comments
                .filter((c) => c.postId === selectedPostId)
                .map((c, i) => (
                  <React.Fragment key={i}>
                    <ListItem alignItems="flex-start" sx={{ alignItems: "flex-start", flexDirection: "column", p: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>Pro</Avatar>
                          <Box>
                            <Typography variant="subtitle2">Username</Typography>
                            <Typography variant="caption">{new Date().toLocaleDateString()}</Typography>
                          </Box>
                        </Box>
                        <Button size="small" color="error" onClick={() => handleDeleteComment(i)}>Delete</Button>
                      </Box>
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          border: "1px solid #ccc",
                          borderRadius: 1,
                          width: "100%",
                        }}
                      >
                        <Typography variant="body2">{c.content}</Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          </Box>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
            <IconButton color="primary" onClick={toggleLike}>
              <ThumbUpIcon />
            </IconButton>
            <Typography>{likes[selectedPostId] || 0}</Typography>

            <IconButton color="error" onClick={toggleDislike}>
              <ThumbDownIcon />
            </IconButton>
            <Typography>{dislikes[selectedPostId] || 0}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
