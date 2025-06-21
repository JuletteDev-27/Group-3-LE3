import { Grid, Stack, Typography, Box, Skeleton, Button } from "@mui/material"
import { UserProfilePicture } from "./UserProfilePicture"
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import axios from "axios";


export const ReplyComponent = ({replyOwnerData, replyContent , postId, replyID, userBearerToken, setUserReplies, currentUserID, replierID}) => {
    const handleDelete = async () => {
    try {
        const response = await axios.delete(`https://supabase-socmed.vercel.app/post/${postId}/replies/${replyID}`, {
        headers: {
            Authorization: `Bearer ${userBearerToken}`
        }
        });

        setUserReplies(prev => {
        const updated = { ...prev };
        if (updated[postId]) {
            updated[postId].replies = updated[postId].replies.filter(r => r.id !== replyID);
            sessionStorage.setItem("userReplies", JSON.stringify(updated));
        }
        return updated;
        });

    } catch (error) {
        console.error("Failed to delete reply:", error);
    }
    };

    return (
        <>
            <Grid container sx={{ width:"100%", padding:4, gap:2}}>
                {(currentUserID === replierID) && (
                    <Grid item size={{ xs:12 }}>
                        <Button color="error" variant="outlined" size="small" onClick={handleDelete}>Delete Reply</Button>
                    </Grid>
                )}
                
                <Grid item size={{ xs:12 }}>
                    <Stack spacing={1} direction={"row"} alignItems={"center"}>
                        <UserProfilePicture imageSrc={`${replyOwnerData?.profile_picture}?t=${Date.now()}`} />
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
