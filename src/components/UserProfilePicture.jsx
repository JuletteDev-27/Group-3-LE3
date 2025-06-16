import { Avatar } from "@mui/material"

export const UserProfilePicture = ({ imageSrc, lgWidthHeight, xsWidthHeight }) => {
  return (
    <Avatar sx={{width: {lg: `${lgWidthHeight}px`,xs:`${xsWidthHeight}px`},height: {lg: `${lgWidthHeight}px`,xs:`${xsWidthHeight}px`}}} src={imageSrc || ""}/>
  )
}
