import { useEffect, useState } from "react"
import { useUserBearerToken } from "../components/userBearerTokenContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Grid, Typography, TextField, List, ListItem, ListItemButton, Stack, IconButton, Skeleton} from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ButtonBase from '@mui/material/ButtonBase';
import { useUserData } from "../components/UserDataContext"
import { RedirectIfNoToken } from "../components/RedirectIfNoToken"
import { LoadingModal } from "../components/LoadingModal"
import { UserProfilePicture } from "../components/UserProfilePicture"

import Navbar from "../components/NavBar"

export const UserProfile = () => {

    const navigate = useNavigate();
    const {userBearerToken} = useUserBearerToken()
    const {userData, setUserData} = useUserData();
    const [isLoading, setIsLoading] = useState(false);
    RedirectIfNoToken(userBearerToken, navigate)
    
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
            console.log(response.data)
            setUserData(response.data);
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
      <Navbar/>
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
      
    </Grid>
  )
}
