import { Grid, Stack, Typography, Box, Skeleton } from "@mui/material"
import { UserProfilePicture } from "./UserProfilePicture"
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';


export const PostComponent = ({postOwnerData, postContent ,postLikesCount, postRepliesCount, postID, postDateCreated, isLloading, isLiked}) => {
  return (
      
        <Grid container sx={{ width:"100%", padding:3}}>
            <Grid item size={{ xs:12 }}>
                <Stack spacing={1} direction={"row"} alignItems={"center"}>
                    <UserProfilePicture imageSrc={postOwnerData?.profile_picture} />
                    <Typography variant="body1" color="initial">{postOwnerData?.fName + " " + postOwnerData?.lName}</Typography>
                </Stack>
            </Grid>
            <Grid item size={{ xs:12 }}>
                <Stack direction={"row"} alignItems={"center"}>
                <Typography variant="subtitle1" color="initial">Created at {postDateCreated}</Typography>
                </Stack>
            </Grid>
            <Grid item size={{ xs:12 }}>
                <Stack direction={"row"} alignItems={"center"}>
                    <Typography variant="body1" color="initial">{postContent}</Typography>
                </Stack>
            </Grid>
            <Grid item size={{ xs:12 }}>
                <Stack spacing={.5} direction={"row"} sx={{ display:"flex", alignItems:"center", height:"fit-content"}}>
                    <Typography variant="body1" color="initial">Likes</Typography>
                    <ThumbUpRoundedIcon fontSize="small" sx={{ placeSelf:"start" }}/>
                    <Typography>: {postLikesCount}</Typography>
                </Stack>
            </Grid>
        </Grid>
    
   
    
  )
}
