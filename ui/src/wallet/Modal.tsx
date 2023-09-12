import { Button, Modal, Box, Typography, Alert, TextField, MenuItem, Select, Grid, InputLabel, FormControlLabel, Checkbox } from "@mui/material";
import React from "react";

interface WalletModalProps {
    open: boolean
    onClose: () => void
    actionText: string
    handleSubmit: () => void
}

export const WalletModal = (props: WalletModalProps) => {
    const [display] = React.useState({ display: 'none' })
    const [text] = React.useState('')

    const [currency, setCurrency] = React.useState('')
    const [category, setCategory] = React.useState('')
    const [account, setAccount] = React.useState('')

    return (
          <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {props.actionText}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Box component="form" onSubmit={props.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Alert id="wrong-password-alert" severity="error" sx={display}>{text}</Alert>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputLabel>Name</InputLabel>
                            <TextField required fullWidth name="name" type="text" variant="standard"/>
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel>Amount</InputLabel>
                            <TextField required fullWidth name="amount" type="number" variant="standard"/>
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                required
                                fullWidth
                                value={category}
                                label="Category"
                                name="category"
                                variant="standard"
                                onChange={(event) => setCategory(event.target.value)}
                            >
                                <MenuItem value='Bonus'>Bonus</MenuItem>
                                <MenuItem value='Daily'>Daily</MenuItem>
                                <MenuItem value='Fashion'>Fashion</MenuItem>
                                <MenuItem value='Funding'>Funding</MenuItem>
                                <MenuItem value='IT Stuff'>IT Stuff</MenuItem>
                                <MenuItem value='Misc'>Misc</MenuItem>
                                <MenuItem value='ROI'>ROI</MenuItem>
                                <MenuItem value='Rent'>Rent</MenuItem>
                                <MenuItem value='Salary'>Salary</MenuItem>
                                <MenuItem value='Temp'>Temp</MenuItem>
                                <MenuItem value='Transfer'>Transfer</MenuItem>
                                <MenuItem value='Travel'>Travel</MenuItem>
                                <MenuItem value='Wellness'>Wellness</MenuItem>
                                <MenuItem value='Zakat'>Zakat</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Currency</InputLabel>
                            <Select
                                required
                                fullWidth
                                value={currency}
                                label="currency"
                                name="currency"
                                variant="standard"
                                onChange={(event) => setCurrency(event.target.value)}
                            >
                                <MenuItem value={'SGD'}>SGD</MenuItem>
                                <MenuItem value={'IDR'}>IDR</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Account</InputLabel>
                            <Select
                                required
                                fullWidth
                                value={account}
                                label="account"
                                name="account"
                                variant="standard"
                                onChange={(event) => setAccount(event.target.value)}
                            >
                                <MenuItem value={'DBS'}>DBS</MenuItem>
                                <MenuItem value={'BCA'}>BCA</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox color="secondary" name="done" value="yes" />}
                                label="Is this transaction done?"
                            />
                        </Grid>
                    </Grid>

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Submit
                    </Button>
                    </Box>
              </Typography>
            </Box>
          </Modal>
      );
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };