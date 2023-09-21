import { ThemeProvider } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AppBar } from './AppBar';
import { Drawer } from './Drawer';
import Chart from './Chart';
import { defaultTheme } from './constant';
import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext, UserContextType } from './UserContext';
import axios from 'axios';
import { WalletAlert, WalletDashboardData, WalletDetail } from './WalletModels';
import { SeanmcappResponse } from '../CommonModels';
import { Title } from './Title';
import { Detail } from './Detail';
import { WalletModal } from './Modal';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, CssBaseline, Toolbar, IconButton, Typography, Divider, List, ListItemButton, ListItemIcon, ListItemText, Container, Alert, Grid, Paper } from '@mui/material';

export const Wallet = () => {
    const { userContext, savePassword } = useContext(UserContext) as UserContextType;
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState<WalletAlert>({display: 'none', text: ''})
    const [data, setData] = useState<WalletDashboardData|null>(null);
    const [walletDetail, setWalletDetail] = useState<WalletDetail|null>(null)
    const [date, setDate] = useState('')

    const toggleDrawer = () => setOpen(!open)

    const onSuccess = (row: WalletDetail, actionText: String|undefined) => {
      setWalletDetail(null)
      if (data !== null) {
        if (actionText === 'Create') {
          const updatedDetail = {...data, detail: [...data.detail, row]}
          setData(updatedDetail)
        } else if (actionText === 'Edit') {
          const index = data?.detail.findIndex((d) => d.id === row.id) ?? -1
          if (index && index > -1 && data) {
            const updatedDetail = {...data, detail: [...data.detail.filter((_, i) => i !== index), row]}
            setData(updatedDetail)
          }
        } else if (actionText === 'Delete') {
          const index = data?.detail.findIndex((d) => d.id === row.id) ?? -1
          if (index && index > -1 && data) {
            setData({...data, detail: data.detail.filter((_, i) => i !== index)})
          }
        }
      }
    }

    const getWalletDashboard = (dateParam: string) => {
      axios.get('api/wallet/dashboard', {
        params: {
          date: dateParam
        },
        auth: {
          username: 'bayu',
          password: userContext ?? ""
        }
      })
      .then((response) => {
        setAlert({display: 'none', text: ''})
        const apiData: SeanmcappResponse<WalletDashboardData> = response.data
        setData(apiData.data)
        setDate(dateParam)
      })
      .catch((error) => {
        console.log(error)
        setAlert({display: 'true', text: 'Data failed to fetch/parse!'})
      })
    }

    useEffect(() => {
      const newDate = new Date()
      const dateString = newDate.getFullYear().toString() + ('0' + (newDate.getMonth() + 1).toString()).slice(-2)
      setDate(dateString)
      getWalletDashboard(dateString)
    }, [])

    if (userContext != null) {
      return (
        <>
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
                <IconButton color="inherit" onClick={() => savePassword(null)}>
                  <LogoutIcon />
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
                <Alert id="invalid-data-alert" severity="error" sx={{ display: alert.display}}>{alert.text}</Alert>
                <Grid container spacing={3}>
                  {/* Balance */}
                  <Grid item xs={12} md={8} lg={9}>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 240, }}>
                        <Chart data={data?.chart.balance ?? []} />
                    </Paper>
                  </Grid>
                  {/* Saving accounts */}
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 240, }}>
                      <Title>Current Savings</Title>
                      <Typography color="text.secondary">
                        on DBS account
                      </Typography>
                      <Typography component="p" variant="h5" sx={{ flex: 0.5 }}>
                        S$ {data?.savings.dbs.toLocaleString()}
                      </Typography>
                      <Typography color="text.secondary">
                        on BCA account
                      </Typography>
                      <Typography component="p" variant="h5">
                        Rp. {data?.savings.bca.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                  {/* Data */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                      <Detail 
                        date={date}
                        rows={data?.detail ?? []} 
                        updateDashboard={getWalletDashboard}
                        createHandler={() => {setWalletDetail({ id: -1 } as WalletDetail)}}
                        editHandler={(walletDetail: WalletDetail) => {setWalletDetail(walletDetail)}} 
                        deleteHandler={(id: Number) => {setWalletDetail({ id: id} as WalletDetail)}} 
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>

        <WalletModal 
          onClose={() => setWalletDetail(null)}
          date={date}
          onSuccess={onSuccess}
          walletDetail={walletDetail}
          />
        </>
      );
    } else {
      return <Navigate to="/wallet/login" />
    }
}
