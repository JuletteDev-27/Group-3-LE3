import { useEffect, useState } from 'react';
import { Grid, Typography, List, ListItem, ListItemButton, Stack, IconButton, Skeleton, Button, Box, Collapse, Alert, AlertTitle, TextField, InputAdornment} from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { retrieveUserData, setUserData } from '../components/UserDataHandler';
import { UserProfilePicture } from '../components/UserProfilePicture';
import { PostComponent } from "../components/PostComponent"
import { ThumbDown, ThumbUp } from "@mui/icons-material"
import { ReplyComponent } from '../components/ReplyComponent';
import { retrieveSessionToken } from '../components/sessionTimeoutHandler';
import { useLiveUserPosts} from '../components/UserPostsHandler';
import SendIcon from '@mui/icons-material/Send';
const HomePage = () => {

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const userBearerToken = retrieveSessionToken()
  const userData = retrieveUserData()
  const [userLikes, setUserLikes] = useState([])
  const [page, setPage] = useState(1)
  const {userPosts, userReplies, isLoading, setUserReplies} = useLiveUserPosts(page, retrieveSessionToken());
  const posts = userPosts?.[page] || [];
  const [likedUnliked, setLikedUnliked] = useState(false)
  const [openReplies, setOpenReplies] = useState({})
  const [currentReply, setCurrentReply] = useState({})
  const [currentPost, setCurrentPost] = useState(null)

    useEffect(() => {
      if (successMsg || errorMsg) {
        const timer = setTimeout(() => {
          setSuccessMsg("");
          setErrorMsg("");
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [successMsg, errorMsg]);

    useEffect(() => {
       const fetchLikedPosts = async () => {
        try {
          const response = await axios.get(`https://supabase-socmed.vercel.app/user/likes`, {
            headers: {
              Authorization: `Bearer ${userBearerToken}`,
            },
          });
          const likedPostIds = response.data.map((item) => item.posts?.id).filter(Boolean);
          setUserLikes(likedPostIds);
        } catch (error) {
          console.error("Failed to fetch liked posts:", error);
          setErrorMsg("Failed to fetch liked posts.");
        }
      };

      fetchLikedPosts();
    }, []);

    const handleUploadPost = async () => {
      if (currentPost === "") {
        setErrorMsg("Post content cannot be empty.");
        return;
      }

      try {
        const response = await axios.post(
          "https://supabase-socmed.vercel.app/post",
          { content: currentPost },
          {
            headers: {
              Authorization: `Bearer ${userBearerToken}`,
            },
          }
        );
        setCurrentPost("");
        setSuccessMsg("Post uploaded successfully.");
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to upload post.");
      }
    };

    const handlePostReply = async (reply, postID) => {
      if (reply === "") {
        setErrorMsg("Reply cannot be empty.");
        return;
      }

      try {
        await axios.post(
          `https://supabase-socmed.vercel.app/post/${postID}/replies`,
          { content: reply },
          {
            headers: {
              Authorization: `Bearer ${userBearerToken}`,
            },
          }
        );

        setCurrentReply((prev) => ({
          ...prev,
          [postID]: "",
        }));
        setSuccessMsg("Reply posted successfully.");
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to post reply.");
      }
    };


    const getUpdatedLikes = async () => {
    try {
      const response = await axios.get(`https://supabase-socmed.vercel.app/user/likes`, {
        headers: {
          Authorization: `Bearer ${userBearerToken}`,
        },
      });

      const likedPostIds = response.data.map(item => item.posts?.id).filter(Boolean);

      setUserLikes(likedPostIds);
    } catch (error) {
      console.error("Failed to update liked posts:", error);
    }
  };


    const toggleLike = async (postId) => {
      try {
        const isLiked = userLikes.includes(postId);
        setLikedUnliked(true);

        if (isLiked) {
          await axios.delete(`https://supabase-socmed.vercel.app/post/${postId}/likes`, {
            headers: { Authorization: `Bearer ${userBearerToken}` },
          });
          setSuccessMsg("Post unliked.");
        } else {
          await axios.post(`https://supabase-socmed.vercel.app/post/${postId}/likes`, null, {
            headers: { Authorization: `Bearer ${userBearerToken}` },
          });
          setSuccessMsg("Post liked.");
        }

        await getUpdatedLikes();
      } catch (error) {
        console.error("Error toggling like:", error);
        setErrorMsg("Failed to toggle like.");
      }
    };


    const handleShowReplies = (itemId) => {
      setOpenReplies((prev) => {
        const next = {
          ...prev,
          [itemId]: !prev[itemId]
        };

        return next;
      });
    };

  return (
    <>
      <Navbar />
      
      <Box sx={{ display: 'flex', flexDirection:{
        xs:"column",
        lg:"row"
      }, justifyContent:"space-evenly", alignItems:"center", height:"90.3svh", padding:2, backgroundColor:"#B09E7D", position:"relative"}}>
        {successMsg && (
          <Alert severity="success" sx={{ width: "100%", mb: 2, position:"absolute", top:0, left:0, zIndex:2 }}>
            <AlertTitle>Success</AlertTitle>
            {successMsg}
          </Alert>
        )}

        {errorMsg && (
          <Alert severity="error" sx={{ width: "100%", mb: 2, position:"absolute", top:0, left:0, zIndex:2 }}>
            <AlertTitle>Error</AlertTitle>
            {errorMsg}
          </Alert>
        )}
        <Box
          sx={{
            width: '25%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            alignSelf:"center",
            alignItems:"center",
            height:"90%",
            gap:3
          }}
        >
            <Stack spacing={2} sx={{ width:"100%", height:"100%", boxShadow:3, padding:3, backgroundColor:"#D5E5F4", borderRadius:10 }}>
              <Typography variant="h4" color="initial">Upload Post</Typography>
               <TextField
                  id="filled-multiline-static"
                  label="What's On Your Mind Today?"
                  multiline
                  rows={16  }
                  variant="filled"
                  value={currentPost}
                  onChange={(e)=>{setCurrentPost(e.target.value)}}
                  sx={{ backgroundColor:"#E6D8C7" }}
                />
                <Button variant='contained' onClick={handleUploadPost} fullWidth>
                  Post
                  <IconButton>
                    <SendIcon/>
                  </IconButton>
                </Button>
                
            </Stack>
            <Stack direction={"column"} alignItems={"center"} sx={{ width:"max-content" }}>
              <UserProfilePicture imageSrc={`${userData?.profile_picture}?t=${Date.now()}`} lgWidthHeight={150} xsWidthHeight={150}/>
              <Typography variant='h5' fontWeight={700} sx={{ mt: 1 }}>{userData.fName + " " + userData.lName}</Typography>
              <Typography variant='subtitle' fontWeight={300} fontStyle={"italic"} sx={{ mt: 1 }}>@{userData.email}</Typography>
            </Stack>
          
        </Box>
        <Grid container sx={{width:1000, padding: 2,  maxHeight:"90svh"}}>
          <Stack direction="row" width="100%" spacing={2} mb={2} justifyContent={"center"} alignItems={"center"} sx={{ position:"sticky", top:0, zIndex:1, backgroundColor:"white", height:"100%", padding:2, boxShadow:3, borderRadius:10 }}>
            <Button variant="contained" onClick={() => setPage(prev => (prev > 1 ? prev - 1 : prev))}>Previous</Button>
            <Typography variant="body1">Page {page}</Typography>
            <Button variant="contained" onClick={() => setPage(prev => prev + 1)}>Next</Button>
          </Stack>

          <List sx={{ width: "100%", overflowY: "scroll", overflowX: "hidden", maxHeight: "80svh", padding:1 }}>
            {(isLoading ? [...Array(9)] : posts).map((item, index) => {
              const post = isLoading ? {} : item;
              return (
                <ListItem
                  key={isLoading ? index : post.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#E6D8C7",
                    boxShadow: 3,
                    mb: 2,
                    padding: 2,
                    width: "100%",
                    borderRadius:10, 
                    borderColor:"#0B1657",
                    borderWidth:2,
                    borderStyle:"solid"
                  }}
                >

                  {isLoading ? (
                    <>
                      <Stack spacing={1} direction="row" alignItems="center" sx={{ placeSelf:"start" }}> 
                        <Skeleton variant="circular" width={100} height={100} />
                        <Skeleton variant="text" width={100} height={10} />
                      </Stack>
                      <Skeleton variant="text" width="100%" height={10} />
                      <Skeleton variant="rectangular" width="100%" height={100} />
                      <Skeleton variant="text" width={100} height={10} />
                    </>
                  ) : (
                    <>
                       <Stack direction="row" spacing={1} sx={{ width: "100%", mb: 2 }}>
                          <IconButton
                            onClick={() => toggleLike(item.id)}
                            color={userLikes.includes(item.id) ? "primary" : "default"}
                            sx={{
                              borderRadius: 50,
                              transition: "color 0.3s ease",
                              "&:hover": {
                                color: userLikes.includes(item.id) ? "#1565c0" : "blue",
                              }
                            }}
                          >
                            <ThumbUp />
                          </IconButton>

                        </Stack>
                      <PostComponent
                        postOwnerData={post.users}
                        postContent={post.content}
                        postDateCreated={post.created_at}
                        postRepliesCount={post.replies?.[0]?.count ?? 0}
                        postLikesCount={post.likes?.[0]?.count ?? 0}
                        postID={post.id}
                        isLoading={isLoading}
                      />

                      <TextField
                        fullWidth
                        label="Write your reply"
                        variant="filled"
                        value={currentReply[item.id]}
                        onChange={(e) => {
                          setCurrentReply((prev)=>({
                            ...prev,
                            [item.id]: e.target.value
                          }))
                        }}
                        InputProps={{ 
                          endAdornment:(
                            <InputAdornment position='end'>
                              <IconButton onClick={()=>handlePostReply(currentReply[item.id], item.id)}>
                                <SendIcon/>
                              </IconButton>
                            </InputAdornment>
                          )
                         }}
                      />

                      <ListItemButton sx={{ placeSelf:"start" }} onClick={() => handleShowReplies(post.id)}>
                        open replies
                      </ListItemButton>

                      <Collapse sx={{ placeSelf:"end", width:"100%" }} in={!!openReplies[post.id]} timeout="auto" unmountOnExit>
                        <List
                          sx={{
                            width: "100%",
                            maxHeight: "200px",
                            overflowY: "scroll",
                            overflowX: "hidden",
                            scrollbarColor: "transparent",
                          }}
                        >
                          {userReplies[post.id]?.replies?.map((reply) => (
                            <ReplyComponent
                              key={reply.id}
                              replierID={reply.owned_by}
                              replyContent={reply.content}
                              userBearerToken={userBearerToken}
                              replyID={reply.id}
                              postId={post.id}
                              replyOwnerData={reply.users}
                              setUserReplies={setUserReplies}
                              currentUserID={userData.id}
                            />
                          ))}
                        </List>
                      </Collapse>
                    </>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Grid>

      </Box>
    
    </>
    
  );
};

export default HomePage;