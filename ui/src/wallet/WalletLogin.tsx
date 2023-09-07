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

export const WalletLogin = () => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
          email: data.get('email'),
          password: data.get('password'),
        });
      };

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
                <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
    );
}