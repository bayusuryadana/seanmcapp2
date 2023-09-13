import { Modal, Box, Typography, Button } from "@mui/material"
import { modalStyle } from "./constant"

interface ConfirmModalProps {
    open: boolean
    onClose: () => void
    deleteHandler: () => void
}

export const ConfirmModal = (props: ConfirmModalProps) => {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure want to delete this?
              </Typography>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={props.deleteHandler}>
                Delete
              </Button>
            </Box>
          </Modal>
    )
}
