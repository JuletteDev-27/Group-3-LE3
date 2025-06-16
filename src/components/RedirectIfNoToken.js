import { useEffect } from "react"

export const RedirectIfNoToken = ( userBearerToken, navigate ) => {
    useEffect(()=>{
        if(userBearerToken === undefined){
            navigate("/")
        }
    },[userBearerToken, navigate])
}
