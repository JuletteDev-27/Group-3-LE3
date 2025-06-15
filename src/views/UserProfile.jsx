import { useEffect, useState } from "react"
import { useUserBearerToken } from "../components/userBearerTokenContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Grid, Typography, TextField, InputAdornment, CircularProgress, IconButton, Avatar } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ButtonBase from '@mui/material/ButtonBase';

export const UserProfile = () => {
    const navigate = useNavigate();
    const {userBearerToken} = useUserBearerToken()
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true)
    
    const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    const maxSizeInMB = 5;

    if (file && file.size > maxSizeInMB * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      event.target.value = "";
      return;
    }

    if (file) {
      setLoading(true);

      const formData = new FormData();
      formData.append("profile", file);

      const patchProfilePicture = async () => {
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
          
          setUserData(response.data[0]);
          console.log(userData)
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      patchProfilePicture();
    }
  };

    useEffect(()=>{
        if(userBearerToken === undefined){
            navigate("/")
        }
    },[userBearerToken, navigate])

    useEffect(()=>{
        const fetchUserData = async () =>{
          try {
            const response = await axios.get('https://supabase-socmed.vercel.app/user', {
              headers: {
                Authorization: `Bearer ${userBearerToken}`
              }
            })
            setUserData(response.data)
            setLoading(false)
          } catch (error) {
            console.error(error)
          }
        }

        fetchUserData()
    },[userBearerToken])

     
  return (
    <Grid container spacing={0} sx={{ 
      width: {
        sm:"100%",
        md:"500px"
    }, boxShadow:3, borderRadius: 3, padding: 4 }}>
      <Grid item size={{ xs:12 }} sx={{ paddingBlock: 2 }}>
        <Typography variant="h3" color="initial">User Profile</Typography>
      </Grid>
      {loading && (
        <Grid size={{ xs: 12 }} sx={{ padding:2, textAlign: "center" }} > 
          <Typography variant="h3" color="info" sx={{ fontWeight:"bold" }}>Loading <CircularProgress /></Typography>
        </Grid>
      )}
      {!loading && (
        <>  
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
                  <Avatar sx={{
                    width: {
                      lg: "200px",
                      xs:"100px"
                    },
                    height: {
                      lg: "200px",
                      xs:"100px"
                    }
                   }}
                  src={typeof userData.profile_picture != null ? userData.profile_picture : ""}/>
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
                value={userData.fName + " " + userData.lName}
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
                value={userData.email}
                InputProps={{ 
                  readOnly: true
                }}
              />
          </Grid> 
          
        </>
      )}
      
    </Grid>
  )
}
