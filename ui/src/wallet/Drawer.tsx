import { ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { defaultTheme, drawerWidth } from './constant';
import { Toolbar, IconButton, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

interface WalletDrawerProps {
  open: boolean
  toggleDrawer: () => void
}

export const WalletDrawer = (props: WalletDrawerProps) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Drawer variant="permanent" open={props.open}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1],}}>
          <IconButton onClick={props.toggleDrawer}>
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
    </ThemeProvider>
  )
}