import { Modal, Stack, Typography, CircularProgress } from "@mui/material"

export const LoadingModal = () => {
  return (
     <Modal open="true" sx={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
          <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor:"white", boxShadow:3, width:"max-content", height:"max-content", padding:4, borderRadius:4 }} spacing={2}>
            <Typography variant="h4" color="initial" >
              Loading
            </Typography>
            <CircularProgress />
          </Stack>
       </Modal>
  )
}
