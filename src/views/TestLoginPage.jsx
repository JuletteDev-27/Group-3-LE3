import { Grid, TextField, InputAdornment, IconButton, Button } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useUserData } from "../components/UserDataContext"
import { useEffect, useState } from "react"
import axios from "axios";
import { useUserBearerToken } from "../components/userBearerTokenContext";
import { useNavigate } from "react-router-dom";
import { LoadingModal } from "../components/LoadingModal";


export const TestLoginPage = () => {

    const navigate = useNavigate();
    const {userData, setUserData} = useUserData()
    const {userBearerToken, setUserBearerToken} = useUserBearerToken()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const[userCredentials, setUserCredentials] = useState({
        email:"",
        password:""
    })
    const[inputErrors, setInputErrors] = useState({
        email: null,
        password: null
    })
    const [showPassword, setShowPassword] = useState(false)

    useEffect(()=>{
        const SignIn = async () =>{
            console.log("submitting")
            setIsLoading(true)
            try {
                const response = await axios.post("https://supabase-socmed.vercel.app/sign-in", {
                    "email": userCredentials.email,
                    "password": userCredentials.password
                }, {
                    headers:{
                        "Content-Type": "application/json"
                }})
                    if(response.data.status === 400){
                        setIsLoading(false)
                        setInputErrors((prev)=>({
                        ...prev,
                        email:"Invalid Email/Password!",
                        password:"Invalid Email/Password!"
                    }))
                    return
                }
                setUserBearerToken(response.data.access_token)
            } catch (error) {
                setIsSubmitted(false)
                setIsLoading(false)
                console.error(error)
            }
        }
        if(inputErrors.email === null && inputErrors.password === null && isSubmitted){
            SignIn()
            setIsSubmitted(false)
        }
    },[inputErrors,isSubmitted])

    useEffect(()=>{
        const fetchUserData = async () =>{
            try {
                const response = await axios.get("https://supabase-socmed.vercel.app/user", {
                    headers:{
                        Authorization: `Bearer ${userBearerToken}`
                    }
                })
                setUserData(response.data)
                
            } catch (error) {
                
                console.log(error)
            }
        }

        if(userBearerToken !== undefined){
            fetchUserData()
            setIsLoading(false)
            navigate("/User-HomePage")
        }
    },[userBearerToken])

    const handleSubmit = (event) =>{
        verifyInput(userCredentials)
        if(inputErrors.email == null && inputErrors.password == null){
            setIsSubmitted(true)
        }
    }

    const verifyInput = (inputData) =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (inputData.email == ""){
            setInputErrors((prev)=>({
                ...prev,
                email:"This is a required field!"
            }))
        }

        if (inputData.password == ""){
            setInputErrors((prev)=>({
                ...prev,
                password:"This is a required field!"
            }))
        }

        if(!emailRegex.test(inputData.email)){
             setInputErrors((prev)=>({
                ...prev,
                email:"Provided input is not an email!"
            }))
        }
    }

    const handleInput = (event) => {
        const {value, name} = event.target
        setIsSubmitted(false)
        setInputErrors((prev)=>({
            ...prev,
            [name]: null
        }))
        setUserCredentials((prev)=>({
            ...prev,
            [name]: value
        }))
    }

  return (
    <Grid container spacing={0} sx={{ width:"500px", justifyItems: "center", boxShadow:3, borderRadius: 3, padding: 4}}>
        {isLoading && (
            <LoadingModal />
        )}
        <Grid item size={{ xs: 12}} padding={1}>
            <TextField
            fullWidth
              id=""
              name="email"
              type="email"
              label="Email"
              value={userCredentials.email}
              onChange={handleInput}
              helperText={inputErrors.email ? inputErrors.email : ""}
              color={inputErrors.email ? "error" : "primary"}
              error={Boolean(inputErrors.email)}
              autoComplete="off"
              required
            />
        </Grid>
         <Grid item size={{ xs: 12}} padding={1}>
            <TextField
            fullWidth
            autoComplete="new-password"
              id=""
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={userCredentials.password}
              onChange={handleInput}
              helperText={inputErrors.password ? inputErrors.password : ""}
              error={Boolean(inputErrors.password)}
              InputProps={{
                endAdornment:(
                    <InputAdornment position="end">
                        <IconButton aria-label="" onClick={()=>setShowPassword(prev=>!prev)}>
                          {showPassword ? <VisibilityOffIcon /> :  <VisibilityIcon/>}
                        </IconButton>
                    </InputAdornment>
                )
              }}
              required
            />
        </Grid>
        <Grid item size={{ xs: 12}} padding={1} >
           <Button variant="contained" color="primary" onClick={handleSubmit}>
             Login
           </Button>
        </Grid>
    </Grid>
  )
}
