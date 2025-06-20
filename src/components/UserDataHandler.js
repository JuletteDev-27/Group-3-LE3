

export const setUserData = ( data ) => {
  sessionStorage.setItem("userData", JSON.stringify(data))
}

export const retrieveUserData = () =>{
    const userData = JSON.parse(sessionStorage.getItem("userData"))
    return userData
}
