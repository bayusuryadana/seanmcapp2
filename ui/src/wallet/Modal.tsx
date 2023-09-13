import { Button, Modal, Box, Typography, Alert, TextField, MenuItem, Select, Grid, InputLabel, FormControlLabel, Checkbox } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { UserContext, UserContextType } from "./UserContext";
import { WalletDetail } from "./WalletModels";
import { modalStyle } from "./constant";

interface WalletModalProps {
    open: boolean
    onClose: () => void
    actionText: string
    date: string
    onSuccess: (row: WalletDetail) => void
}

export const WalletModal = (props: WalletModalProps) => {
    const { userContext } = useContext(UserContext) as UserContextType;

    const [display, setDisplay] = React.useState('none')
    // const [formData, setData] = React.useState<WalletDetail|null>(null)

    const [currency, setCurrency] = React.useState('')
    const [category, setCategory] = React.useState('')
    const [account, setAccount] = React.useState('')

    const getAccount = (currency: string): string => {
        if (currency === 'SGD') 
            return 'DBS'
        if (currency === 'IDR')
            return 'BCA'
        return ''
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        const data = new FormData(event.currentTarget);

        const currency = data.get('currency')?.toString() ?? ""
        const done = data.get('done')?.toString() ? true : false
        const payload = {
            'id': parseInt(data.get('id')?.toString() ?? ""),
            'date': parseInt(props.date),
            'name': data.get('name')?.toString() ?? "",
            'amount': parseInt(data.get('amount')?.toString() ?? ""),
            'category': data.get('category')?.toString() ?? "",
            'currency': currency,
            'account': getAccount(currency),
            'done': done
        }

        console.log(payload)

        axios.post('api/wallet/create', payload, {
            auth: {
                username: 'bayu',
                password: userContext ?? ""
              }
        }).then((response) => {
            setDisplay('none')
            const newData = {...payload, id: response.data.data.id}
            props.onSuccess(newData)
        })
        .catch((error) => {
            console.log(error)
            setDisplay('true')
        })
    }

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
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Alert id="wrong-password-alert" severity="error" sx={{display: display, mb: 1}}>Gagal tot!</Alert>
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
                                onChange={(event) => {
                                    const curr = event.target.value
                                    setCurrency(curr)
                                    setAccount(getAccount(curr).toString())
                                }}
                            >
                                <MenuItem value={'SGD'}>SGD</MenuItem>
                                <MenuItem value={'IDR'}>IDR</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Account</InputLabel>
                            <TextField required disabled fullWidth value={account} name="account" type="text" variant="standard"/>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox color="secondary" name="done" value="yes" />}
                                label="Is it done?"
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
