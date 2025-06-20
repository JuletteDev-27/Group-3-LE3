import { useEffect, useState } from 'react';
import { Grid, Typography, TextField, List, ListItem, ListItemButton, Stack, IconButton, Skeleton, Button, Box, Collapse} from "@mui/material"
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
const HomePage = () => {

  const userBearerToken = retrieveSessionToken()
  const userData = retrieveUserData()
  const [userLikes, setUserLikes] = useState([])
  const [page, setPage] = useState(1)
  const {userPosts, userReplies, isLoading} = useLiveUserPosts(page, retrieveSessionToken());
  const posts = userPosts?.[page] || [];
  const [likedUnliked, setLikedUnliked] = useState(false)
  const [openReplies, setOpenReplies] = useState({})
    useEffect(() => {
      const fetchLikedPosts = async () => {
        try {
          const response = await axios.get(`https://supabase-socmed.vercel.app/user/likes`, {
              headers: {
                Authorization: `Bearer ${userBearerToken}`,
              },
            });
              setUserLikes(response.data);
            } catch (error) {
              console.error("Failed to fetch liked posts:", error);
            }
        };
          
        fetchLikedPosts();  
    }, []);

    const checkIfPostIsLiked = (itemId) => {
      const liked = userLikes.some(post=>post.posts.id === itemId)
      return liked
    }

    const getUpdatedLikes = async () =>{
      try{
        const likesUpdate = await axios.get(`https://supabase-socmed.vercel.app/user/likes`, {
            headers: {
                Authorization: `Bearer ${userBearerToken}`,
              },
            });
            setUserLikes(likesUpdate.data);
      }catch(error){
          console.error(error)
      }
      
      likesUpdate()
    }

    const handleLike = async (postIndex) =>{
      try {
        setLikedUnliked(true)
        const response = await axios.post(`https://supabase-socmed.vercel.app/post/${postIndex}/likes`,null,{
          headers:{
            Authorization: `Bearer ${userBearerToken}`
          }
        })
        if(response.status !== 409){
          getUpdatedLikes()
        }
      }catch (error) {
        console.error(error)
      }
    }

    const handleUnlike = async (postIndex) =>{
      try {
        setLikedUnliked(true)
        const response = await axios.delete(`https://supabase-socmed.vercel.app/post/${postIndex}/likes`,{
          headers:{
            Authorization: `Bearer ${userBearerToken}`
          }
        })

        if(response.status !== 409){
            getUpdatedLikes()
          }
      } catch (error) {
        console.error(error)
      }
    }

   

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
      }, justifyContent:"space-evenly", alignItems:"center", "height":"90svh", padding:2}}>
        <Box
          sx={{
            width: 'max-content',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            alignSelf:"end",
          }}
        >
            <Stack direction={"column"} alignItems={"center"} sx={{ width:"max-content" }}>
              <UserProfilePicture imageSrc={userData?.profile_picture} lgWidthHeight={100} xsWidthHeight={100}/>
              <Typography sx={{ mt: 1 }}>{userData.fName + " " + userData.lName}</Typography>
            </Stack>
          
        </Box>
        <Grid item size={6} sx={{ maxWidth:"1000px", padding:2,  overflowY: "scroll", overflowX:"hidden", maxHeight:"90svh", }}>
          <Stack direction={"row"}>
            <Button variant="contained" onClick={()=>setPage(prev=>prev+1)}>Next</Button>
            <Button variant="contained" onClick={()=>setPage((prev) => (prev > 1 ? prev - 1 : prev))}>Previous</Button> 
            <Typography variant="body1">Page {page}</Typography>
          </Stack>
          <List sx={{ width:"100%" }}>
             {isLoading && 
                [...Array(9)].map((_, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "grid",
                      gap: 0,
                      backgroundColor: "white",
                      boxShadow: 3,
                      mb: 2,
                      padding: 1,
                      width: "100%",
                    }}
                  >
                    <Stack direction="row" sx={{ mb: 2, width: "max-content" }} spacing={1}>
                      <IconButton
                        sx={{
                          width: "max-content",
                          borderRadius: 50,
                          "&:hover": {
                            color: "blue",
                          },
                        }}
                      >
                        <ThumbUp />
                      </IconButton>
                      <IconButton
                        sx={{
                          width: "max-content",
                          borderRadius: 50,
                          "&:hover": {
                            color: "red",
                          },
                        }}
                      >
                        <ThumbDown />
                      </IconButton>
                    </Stack>

                    <ListItemButton sx={{ margin: 0, width: "100%" }}>
                      <Grid container sx={{ width: "max-content", padding: 3, gap: 2 }}>
                        <Grid item xs={12}>
                          <Stack spacing={1} direction="row" alignItems="center">
                            <Skeleton variant="circular" sx={{ width: "100px", height: "100px" }} />
                            <Skeleton variant="rounded" sx={{ width: "100px", height: "10px" }} />
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack direction="row" alignItems="center">
                            <Skeleton variant="text" sx={{ width: "100%", height: "10px" }} />
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack direction="row" alignItems="center">
                            <Skeleton variant="rectangular" sx={{ width: "100%", height: "100px" }} />
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack
                            spacing={0.5}
                            direction="row"
                            sx={{ display: "flex", alignItems: "center", height: "fit-content" }}
                          >
                            <Skeleton variant="rounded" sx={{ width: "100px", height: "10px" }} />
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItemButton>
                  </ListItem>
                ))
              }

              {!isLoading &&
              posts.map((item, index) => (
                <ListItem
                  key={item.id}
                  sx={{
                    display: "grid",
                    gap: 0,
                    backgroundColor: "white",
                    boxShadow: 3,
                    mb: 2,
                    padding: 1,
                    width: "100%",
                  }}
                >
                  <Stack direction="row" sx={{ mb: 2, width: "max-content" }} spacing={1}>
                    <IconButton
                      sx={{
                        width: "max-content",
                        borderRadius: 50,
                        "&:hover": {
                          color: "blue",
                        },
                      }}
                      onClick={() => handleLike(item.id)}
                      color={checkIfPostIsLiked(item.id) ? "primary" : "inherit"}
                    >
                      <ThumbUp />
                    </IconButton>

                    <IconButton
                      sx={{
                        width: "max-content",
                        borderRadius: 50,
                        "&:hover": {
                          color: "red",
                        },
                      }}
                      onClick={() => handleUnlike(item.id)}
                    >
                      <ThumbDown />
                    </IconButton>
                  </Stack>

                  <ListItemButton sx={{ margin: 0, width: "100%" }}>
                    <PostComponent
                      key={item.id}
                      postOwnerData={item.users}
                      postContent={item.content}
                      postDateCreated={item.created_at}
                      postRepliesCount={item.replies?.[0]?.count ?? 0}
                      postLikesCount={item.likes?.[0]?.count ?? 0}
                      postID={item.id}
                      isLoading={isLoading}
                    />
                  </ListItemButton>

                  <ListItemButton onClick={() => handleShowReplies(item.id)}>
                    open replies
                  </ListItemButton>

                  <Collapse in={!!openReplies[item.id]} timeout="auto" unmountOnExit>
                    <List
                      sx={{
                        width: "950px",
                        maxHeight: "200px",
                        overflowY: "scroll",
                        overflowX: "hidden",
                        scrollbarColor: "transparent",
                      }}
                    >
                     {userReplies[item.id]?.replies?.map((reply, index) => (
                        <ReplyComponent
                          key={reply.id}
                          replyContent={reply.content}
                          replyID={reply.id}
                          replyOwnerData={reply.users}
                        />
                      ))}

                    </List>
                  </Collapse>
                </ListItem>
              ))}
 
          </List>
          </Grid>
      </Box>
    
    </>
    
  );
};

export default HomePage;