import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Grid, Typography, TextField, Alert, ButtonBase } from "@mui/material"
import { retrieveUserData, setUserData } from "../components/UserDataHandler"
import { LoadingModal } from "../components/LoadingModal"
import { UserProfilePicture } from "../components/UserProfilePicture"
import Navbar from "../components/NavBar"
import { retrieveSessionToken } from "../components/sessionTimeoutHandler"

export const UserProfile = () => {
  const navigate = useNavigate();
  const userBearerToken = retrieveSessionToken();
  const userData = retrieveUserData();

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timeout = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [successMsg, errorMsg]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    const maxSizeInMB = 5;

    if (file && file.size > maxSizeInMB * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit.");
      event.target.value = "";
      return;
    }

    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    const patchProfilePicture = async () => {
      setIsLoading(true);
      try {
        const response = await axios.patch(
          "https://supabase-socmed.vercel.app/user/profile-picture",
          formData,
          {
            headers: {
              Authorization: `Bearer ${userBearerToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response)

        if (response.status === 200) {
          const userRes = await axios.get("https://supabase-socmed.vercel.app/user", {
            headers: { Authorization: `Bearer ${userBearerToken}` }
          });
          setUserData(userRes.data);
          setSuccessMsg("Profile picture updated successfully.");
        }
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        setErrorMsg("Failed to upload. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    patchProfilePicture();
  };

  return (
    <>
      <Navbar />
      <Grid container spacing={3} sx={{ justifyContent: "center", alignItems: "center", height: "90svh", position: "relative" }}>

        {(successMsg || errorMsg) && (
          <Alert
            severity={successMsg ? "success" : "error"}
            variant="filled"
            sx={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              width: "80%",
              maxWidth: 500
            }}
          >
            {successMsg || errorMsg}
          </Alert>
        )}

        <Grid item size={6} sx={{
          width: {
            sm: "100%",
            md: "500px"
          }, boxShadow: 3, borderRadius: 3, padding: 4, height: "max-content"
        }}>
          <Grid item size={{ xs: 12 }} sx={{ paddingBlock: 2 }}>
            <Typography variant="h3" color="initial">User Profile</Typography>
          </Grid>

          {isLoading && <LoadingModal />}

          <Grid item size={{ xs: 12 }} sx={{ paddingBlock: 1, display: "grid" }} alignItems={"center"} justifyItems={"center"}>
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
                '&:hover': {
                  '&:after': {
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
                    color: "white"
                  }
                }
              }}>
              <UserProfilePicture imageSrc={`${userData?.profile_picture}?t=${Date.now()}`} lgWidthHeight={200} xsWidthHeight={200} />
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

          <Grid item size={{ xs: 12 }} sx={{ paddingBlock: 1 }}>
            <TextField
              fullWidth
              variant="standard"
              label="User Full Name"
              value={isLoading ? "" : `${userData.fName} ${userData.lName}`}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item size={{ xs: 12 }} sx={{ paddingBlock: 1 }}>
            <TextField
              fullWidth
              variant="standard"
              type="email"
              label="Email"
              value={isLoading ? "" : userData.email}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
