import { defaultTheme } from "./constant"
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { AppBar } from './AppBar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import { useContext, useState, FormEvent } from 'react';
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "@mui/material";
import { UserContext, UserContextType } from "./UserContext";

export const WalletLogin = (_props: any) => {
  const  { userContext, savePassword } = useContext(UserContext) as UserContextType;
  const [display, setDisplay] = useState({ display: 'none' })
  const [text, setText] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const inputPassword = data.get('password')?.toString() ?? ""

    axios.post('/api/wallet/login', {}, {
      auth: {
        username: 'bayu',
        password: inputPassword
      }
    })
    .then(() => {
      setDisplay({ display: 'none' })
      savePassword(inputPassword)
    })
    .catch((error) => {
      console.log(error);
      setDisplay({ display: 'true'})
      if (error.response && error.response.status == 404) {
        setText("Anjing gak nyambung!")
      } else if (error.response.status == 403) {
        setText("Salah password goblok!")
      } else {
        setText("Gatau nih gabisanya kenapa tot!")
      }
    });
  };
  
  if (userContext == null) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute">
            <Toolbar sx={{ pr: '24px', }}>
              <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                Seanmcwallet
              </Typography>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 8,
              paddingTop: 8,
            }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Alert id="wrong-password-alert" severity="error" sx={display}>{text}</Alert>
              <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Sign In
              </Button>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  } else {
    return <Navigate to="/wallet" />
  }
}