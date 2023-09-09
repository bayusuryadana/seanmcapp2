import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AppBar } from './AppBar';
import { Drawer } from './Drawer';
import Chart from './Chart';
import { defaultTheme } from './constant';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext, UserContextType } from './UserContext';
import axios from 'axios';

export const Wallet = () => {
    const { userContext, savePassword } = useContext(UserContext) as UserContextType;
    const [open, setOpen] = React.useState(false);
    // const [data, setData] = React.useState(null);
    const toggleDrawer = () => {
      setOpen(!open);
    };

    const logoutHandler = () => {
      savePassword(null)
    }

    const date = new Date()
    const dateString = date.getFullYear().toString() + ('0' + (date.getMonth() + 1).toString()).slice(-2)
    axios.get('api/wallet/dashboard', {
      params: {
        date: dateString
      },
      auth: {
        username: 'bayu',
        password: userContext ?? ""
      }
    })
    .then((response) => {console.log(response)})
    .catch((error) => {console.log(error)})

    if (userContext != null) {
      return (
        <ThemeProvider theme={defaultTheme}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
              <Toolbar sx={{ pr: '24px', }}>
                <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }),}}>
                  <MenuIcon />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                  Seanmcwallet
                </Typography>
                <IconButton color="inherit" onClick={logoutHandler}>
                  <Badge color="secondary">
                    <LogoutIcon />
                  </Badge>
                </IconButton>
              </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
              <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1],}}>
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List component="nav">
                <ListItemButton>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItemButton>
              </List>
            </Drawer>
            <Box component="main" sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}
            >
              <Toolbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  {/* Balance */}
                  <Grid item xs={12} md={8} lg={9}>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 240, }}>
                        <Chart />
                    </Paper>
                  </Grid>
                  {/* Saving accounts */}
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 240, }}>
                    </Paper>
                  </Grid>
                  {/* Data */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      );
    } else {
      return <Navigate to="/wallet/login" />
    }
}
