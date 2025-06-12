import { createContext, useContext } from "react"

export const UserBearerToken = createContext(undefined)

export const UseUserBearerTokenContext = () => {

    const userBearerToken = useContext(userBearerTokenContext)

    if(userBearerToken === undefined){
        throw new Error("This page is not wrapped within Context Provider!")
    }

    return userBearerToken
}


