import { useEffect, useState } from "react"
import { useUserBearerToken } from "../components/userBearerTokenContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Grid, Typography, TextField, List, ListItem, ListItemButton, Stack, IconButton} from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ButtonBase from '@mui/material/ButtonBase';
import { useUserData } from "../components/UserDataContext"
import { RedirectIfNoToken } from "../components/RedirectIfNoToken"
import { LoadingModal } from "../components/LoadingModal"
import { UserProfilePicture } from "../components/UserProfilePicture"
import { PostComponent } from "../components/PostComponent"
import { ThumbDown, ThumbUp } from "@mui/icons-material"

export const UserProfile = () => {

    const navigate = useNavigate();
    const {userBearerToken} = useUserBearerToken()
    const {userData, setUserData} = useUserData();
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    RedirectIfNoToken(userBearerToken, navigate)
    
    useEffect(()=>{
      if(Object.keys(userData).length === 0){
        setIsLoading(true)
        return
      }
      setIsLoading(false)
    },[userData])

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`https://supabase-socmed.vercel.app/post?page=${page}` , {
            headers: {
              Authorization: `Bearer ${userBearerToken}`,
            },
          });
          setPosts(response.data);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
      };

      fetchPosts();

      const intervalId = setInterval(fetchPosts, 5000);

      return () => clearInterval(intervalId); 
    }, [page, userBearerToken])

    const handleLike = async (postIndex) =>{
      try {
        const response = await axios.post(`https://supabase-socmed.vercel.app/post/${postIndex}/likes`, {
          headers: {
            Authorization: `Bearer ${userBearerToken}`,
          },
        })

        console.log(response.status)
      } catch (error) {
        console.error(error)
      }
    }

    const handleAvatarChange = (event) => {
      const file = event.target.files?.[0];
      const maxSizeInMB = 5;

      if (file && file.size > maxSizeInMB * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        event.target.value = "";
        return;
      }

      if (file) {
        const formData = new FormData();
        formData.append("profile", file);

        const patchProfilePicture = async () => {
          setIsLoading(true)
          try {
            const response = await axios.patch(
              "https://supabase-socmed.vercel.app/user/profile-picture",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${userBearerToken}`,
                },
              }
            );
            console.log(response)
            setUserData(response.data[0]);
            setIsLoading(false);
          } catch (error) {
            console.error(error);
          }
        };
        patchProfilePicture();
      }
  };

  return (
    <Grid container spacing={3}>
      <Grid item spacing={0} size={6}  sx={{
        width: {
          sm:"100%",
          md:"500px"
      }, boxShadow:3, borderRadius: 3, padding: 4, height:"max-content" }}>
        <Grid item size={{ xs:12 }} sx={{ paddingBlock: 2 }}>
          <Typography variant="h3" color="initial">User Profile</Typography>
        </Grid>
        {isLoading && (
          <LoadingModal />
        )}
        <Grid item size={{ xs:12 }} sx={{ paddingBlock: 1, display: "grid" }} alignItems={"center"} justifyItems={"center"}>
                  <ButtonBase
                  component="label"
                   sx={{
                    placeSelf: "center",
                    position: "relative",
                    borderRadius: '200px',
                    '&:has(:focus-visible)': {
                      outline: '2px solid',
                      outlineOffset: '2px',
                    },
                    '&:hover':{
                        '&:after':{
                          content: '"Upload Image"',
                          display: "flex",
                          position: "absolute",
                          backgroundColor: "rgba(0,0,0,0.30)",
                          borderRadius: "200px",
                          height: "100%",
                          width: "100%",
                          zIndex: "1",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          fontFamily: "sans-serif",
                          color:"white"
                        }
                      }
                  }}>
                    <UserProfilePicture imageSrc={userData?.profile_picture} lgWidthHeight={200} xsWidthHeight={200} />
                    <input
                      type="file"
                      accept="image/*"
                      style={{
                        border: 0,
                        clip: 'rect(0 0 0 0)',
                        height: '1px',
                        margin: '-1px',
                        overflow: 'hidden',
                        padding: 0,
                        position: 'absolute',
                        whiteSpace: 'nowrap',
                        width: '1px',
                      }}
                      onChange={handleAvatarChange}
                    />
                  </ButtonBase>
              </Grid>
          <Grid item size={{ xs:12 }} sx={{ paddingBlock: 1 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  id=""
                  label="User Full Name"
                  value={isLoading ? "" : userData.fName + " " + userData.lName}
                  InputProps={{
                    readOnly: true
                  }}
                />
            </Grid>
          <Grid item size={{ xs:12 }} sx={{ paddingBlock: 1 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  type="email"
                  id=""
                  label="Email"
                  value={isLoading ? "" : userData.email}
                  InputProps={{
                    readOnly: true
                  }}
                />
            </Grid>
      </Grid>
        <Grid item size={6} sx={{ width:"500px", padding:2,  overflowY: "scroll", maxHeight: "500px" }}>
          <List>
              {posts.map((item,index)=>(
                <ListItem sx={{ display:"grid", gap:0, backgroundColor:"white", boxShadow: 3, mb:2, padding:1 }}>
                  <Stack direction="row" sx={{ mb:2, width:"max-content" }} spacing={1}>
                     <IconButton sx={{width:"max-content", borderRadius:50, '&:hover':{
                      color:"blue"
                     } }} onClick={()=>handleLike(item.id)}>
                      <ThumbUp/>
                     </IconButton>
                      <IconButton sx={{width:"max-content", borderRadius:50, '&:hover':{
                      color:"red"
                     } }} >
                      <ThumbDown/>
                     </IconButton>
                  </Stack>
                 
                  <ListItemButton sx={{ margin:0, width:"100%", boxShadow:10,  }}>
                     <PostComponent key={index} postOwnerData={item.users} postContent={item.content} postDateCreated={item.created_at} postRepliesCount={item.replies[0].count} postLikesCount={item.likes[0].count} postID={item.id} />
                  </ListItemButton>
                </ListItem>
              ))}   
          </List>
        </Grid>
    </Grid>
  )
}
