import { Grid, TextField, InputAdornment, IconButton, Button, Typography, Alert } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoadingModal } from "../components/LoadingModal";
import { setSessionToken } from "../components/sessionTimeoutHandler";
import { setUserData } from "../components/UserDataHandler";
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

export const TestLoginPage = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFailed, setIsFailed] = useState(false)

  const [userCredentials, setUserCredentials] = useState({ email: "", password: "" })
  const [inputErrors, setInputErrors] = useState({ email: null, password: null })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    sessionStorage.clear()
  }, [])

  // ✅ Corrected timeout logic for showing alert
  useEffect(() => {
    if (isFailed) {
      const timeoutId = setTimeout(() => setIsFailed(false), 5000)
      return () => clearTimeout(timeoutId)
    }
  }, [isFailed])

  useEffect(() => {
    const SignIn = async () => {
      setIsLoading(true)
      try {
        const response = await axios.post("https://supabase-socmed.vercel.app/sign-in", {
          email: userCredentials.email,
          password: userCredentials.password
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.data.status === 400) {
          setIsLoading(false);
          setInputErrors({
            email: "Invalid Email/Password!",
            password: "Invalid Email/Password!"
          });
          return;
        }

        setSessionToken(response.data.access_token);

        const userRes = await axios.get("https://supabase-socmed.vercel.app/user", {
          headers: { Authorization: `Bearer ${response.data.access_token}` }
        });

        setUserData(userRes.data)
        navigate("/User-HomePage");

      } catch (error) {
        setIsLoading(false);
        setIsFailed(true);
      } finally {
        setIsSubmitted(false);
      }
    };

    if (inputErrors.email === null && inputErrors.password === null && isSubmitted) {
      SignIn();
    }
  }, [inputErrors, isSubmitted, navigate, userCredentials]);

  const handleSubmit = () => {
    verifyInput(userCredentials);
    if (inputErrors.email == null && inputErrors.password == null) {
      setIsSubmitted(true)
    }
  }

  const verifyInput = (inputData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (inputData.email === "") {
      setInputErrors(prev => ({ ...prev, email: "This is a required field!" }))
    }
    if (inputData.password === "") {
      setInputErrors(prev => ({ ...prev, password: "This is a required field!" }))
    }
    if (!emailRegex.test(inputData.email)) {
      setInputErrors(prev => ({ ...prev, email: "Provided input is not an email!" }))
    }
  }

  const handleInput = (event) => {
    const { value, name } = event.target
    setIsSubmitted(false)
    setInputErrors(prev => ({ ...prev, [name]: null }))
    setUserCredentials(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Grid container sx={{ width: "100%", height: "100svh", justifyContent: "center", alignItems: "center", backgroundColor: "#B09E7D", position: "relative" }}>
      
      {isFailed && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "80%",
            maxWidth: "500px"
          }}
        >
          Login failed. Please check your credentials or try again later.
        </Alert>
      )}

      <Typography variant="h2" sx={{ position: "absolute", top: 0, right: 0, padding: 7, fontWeight: "900", color: "#0B1657" }}>EchoNote</Typography>
      
      <Grid container sx={{ height: "max-content", width: "100%", justifyContent: "center", alignItems: "center" }}>
        <Grid item sx={{ width: "950px", padding: 10 }}>
          <img src="https://www.devicemagic.com/wp-content/uploads/2020/10/person_using_smartphone-2.jpg"
            alt=""
            style={{ width: "100%", border: "10px solid #0B1657", borderRadius: 50 }}
          />
        </Grid>

        <Grid item sx={{ width: { md: "800px" }, padding: 10, borderRadius: 3 }}>
          {isLoading && <LoadingModal />}
          
          <Grid item sx={{ justifyContent: "center", textAlign: "center" }}>
            <StickyNote2Icon sx={{ fontSize: { md: 200 }, color: "black", backgroundColor: "#D5E5F4", padding: 2, border: "10px solid #0B1657", borderRadius: 100 }} />
          </Grid>

          <Grid item padding={1}>
            <TextField
              sx={{ backgroundColor: "#E6D8C7", borderRadius: 1 }}
              fullWidth
              variant="filled"
              name="email"
              type="email"
              label="Email"
              value={userCredentials.email}
              onChange={handleInput}
              helperText={inputErrors.email || ""}
              error={Boolean(inputErrors.email)}
              autoComplete="off"
              required
            />
          </Grid>

          <Grid item padding={1}>
            <TextField
              sx={{ backgroundColor: "#E6D8C7", borderRadius: 1 }}
              fullWidth
              variant="filled"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={userCredentials.password}
              onChange={handleInput}
              helperText={inputErrors.password || ""}
              error={Boolean(inputErrors.password)}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(prev => !prev)}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              required
            />
          </Grid>

          <Grid item padding={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              size="large"
              sx={{ backgroundColor: "#D5E5F4", color: "black", fontWeight: "900", fontSize: "1.5rem" }}
            >
              Login
            </Button>
          </Grid>

          <Grid item padding={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/User-Register")}
              sx={{ backgroundColor: "#0B1657", color: "white", fontWeight: "900", fontSize: "1.5rem" }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
