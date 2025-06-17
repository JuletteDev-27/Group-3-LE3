import { useEffect, useState } from 'react';
import { Grid, Typography, TextField, List, ListItem, ListItemButton, Stack, IconButton, Skeleton, Button, Box, Collapse} from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { RedirectIfNoToken } from '../components/RedirectIfNoToken';
import { useUserBearerToken } from '../components/userBearerTokenContext';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../components/UserDataContext';
import { UserProfilePicture } from '../components/UserProfilePicture';
import { PostComponent } from "../components/PostComponent"
import { ThumbDown, ThumbUp } from "@mui/icons-material"
import { ReplyComponent } from '../components/ReplyComponent';
const HomePage = () => {

  const navigate = useNavigate();
  const {userBearerToken} = useUserBearerToken()
  const {userData, setUserData} = useUserData()
  const [userLikes, setUserLikes] = useState([])
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [likedUnliked, setLikedUnliked] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  RedirectIfNoToken(userBearerToken, navigate)
  const [openReplies, setOpenReplies] = useState({})
  const [postReplies, setPostReplies] = useState({})

  

 useEffect(()=>{
      if(posts.length === 0){
        setIsLoading(true)
      }
    },[posts])

    useEffect(() => {
  let isMounted = true;

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://supabase-socmed.vercel.app/post?page=${page}`, {
          headers: {
            Authorization: `Bearer ${userBearerToken}`,
          },
        });

        if (isMounted) {
          setPosts(response.data);
          setIsLoading(false);
        }
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
    };

      fetchPosts(); 

      const intervalId = setInterval(fetchPosts, 5000);

      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }, [page, userBearerToken]);

    useEffect(()=>{
      console.log(postReplies)
    },[postReplies])

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


    const fetchPostData = async (itemId) =>{
      try {
          const response = await axios.get(`https://supabase-socmed.vercel.app/post/${itemId}`, {
            headers:{
              Authorization: `Bearer ${userBearerToken}`
            }
          })
          setPostReplies((prev)=>({
            ...prev,
            [itemId]: response.data.replies
          }))
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

        if (!prev[itemId]) {
          fetchPostData(itemId);
        }
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
             {isLoading && (
              <Grid>fetching posts ...</Grid>
            )}
              {posts.map((item,index)=>(
                <ListItem sx={{ display:"grid", gap:0, backgroundColor:"white", boxShadow: 3, mb:2, padding:1, width:"100%" }}>
                  <Stack direction="row" sx={{ mb:2, width:"max-content" }} spacing={1}>
                     <IconButton sx={{width:"max-content", borderRadius:50, '&:hover':{
                      color:"blue"
                     }}} onClick={()=>handleLike(item.id)} color={checkIfPostIsLiked(item.id) ? "primary" : "initial"}>
                      <ThumbUp/>
                     </IconButton>
                      <IconButton sx={{width:"max-content", borderRadius:50, '&:hover':{
                      color:"red"
                     } }} onClick={()=>handleUnlike(item.id)}>
                      <ThumbDown/>
                     </IconButton>
                  </Stack>                 
                  <ListItemButton sx={{ margin:0, width:"100%",  }}>
                     <PostComponent key={index} postOwnerData={item.users} postContent={item.content} postDateCreated={item.created_at} postRepliesCount={item.replies[0].count} postLikesCount={item.likes[0].count} postID={item.id} isLoading={isLoading}/>
                  </ListItemButton>
                   <ListItemButton onClick={()=>handleShowReplies(item.id)}>
                     open replies
                   </ListItemButton>
                   <Collapse in={!!openReplies[item.id]} timeout={"auto"} unmountOnExit>
                     <List sx={{ width:"950px", maxHeight:"200px", overflowY:"scroll", overflowX:"hidden", scrollbarColor:"transparent" }}>
                      {postReplies[item.id]?.map((item,index)=>(
                        <ReplyComponent replyContent={item.content} replyID={item.id} replyOwnerData={item.users}/>
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