import { Grid, Stack, Typography, Box, Skeleton } from "@mui/material"
import { UserProfilePicture } from "./UserProfilePicture"
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';


export const ReplyComponent = ({replyOwnerData, replyContent , replyID}) => {
  return (
    <>  
        <Grid container sx={{ width:"max-content", padding:3}}>
            <Grid item size={{ xs:12 }}>
                <Stack spacing={1} direction={"row"} alignItems={"center"}>
                    <UserProfilePicture imageSrc={replyOwnerData?.profile_picture} />
                    <Typography variant="body1" color="initial">Reply From {replyOwnerData?.fName + " " + replyOwnerData?.lName}</Typography>
                </Stack>
            </Grid>
            <Grid item size={{ xs:12 }}>
                <Stack direction={"row"} alignItems={"center"}>
                    <Typography variant="body1" color="initial">{replyContent}</Typography>
                </Stack>
            </Grid>
        </Grid>
    </>
   
    
  )
}
