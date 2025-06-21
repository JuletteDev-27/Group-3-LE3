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

  const userBearerToken = retrieveSessionToken()
  const userData = retrieveUserData()
  const [userLikes, setUserLikes] = useState([])
  const [page, setPage] = useState(1)
  const {userPosts, userReplies, isLoading, setUserReplies} = useLiveUserPosts(page, retrieveSessionToken());
  const posts = userPosts?.[page] || [];
  const [likedUnliked, setLikedUnliked] = useState(false)
  const [openReplies, setOpenReplies] = useState({})
  const [currentReply, setCurrentReply] = useState({})
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

    const handlePostReply = async (reply, postID) => {
      if(reply == ""){

      }
      setCurrentReply((prev)=>({
        ...prev,
        [postID]:""
      }))
      try {
        const response =  await axios.post(`https://supabase-socmed.vercel.app/post/${postID}/replies`,{
          content:reply
          },{headers:{
            Authorization:`Bearer ${userBearerToken}`
          }})

          
      } catch (error) {
        console.error(error)
      }
      
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
        <Grid container sx={{width:1000, padding: 2,  maxHeight:"90svh"}}>
          <Stack direction="row" width="100%" spacing={2} mb={2} justifyContent={"center"} alignItems={"center"} sx={{ position:"sticky", top:0, zIndex:1, backgroundColor:"white", height:"100%", padding:2, boxShadow:3 }}>
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
                    backgroundColor: "white",
                    boxShadow: 3,
                    mb: 2,
                    padding: 2,
                    width: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ width: "100%", mb: 2 }}>
                    <IconButton sx={{ borderRadius: 50, "&:hover": { color: "blue" } }}>
                      <ThumbUp />
                    </IconButton>
                    <IconButton sx={{ borderRadius: 50, "&:hover": { color: "red" } }}>
                      <ThumbDown />
                    </IconButton>
                  </Stack>

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