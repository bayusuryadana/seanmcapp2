import { Box, CssBaseline, Grid, ThemeProvider } from "@mui/material"
import { defaultTheme } from "./constant"
import { MamenMap } from "./MamenMap";

export const Mamen = () => {

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Box component="main" sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}>
        <Grid container>
          <Grid item xs md lg></Grid>
          <Grid item xs={12} md={10} lg={8}>
            <Box p={3}>
              <MamenMap center={{lat: -6.172018, lng: 106.801848}} zoom={13}/>
            </Box>
          </Grid>
          <Grid item xs md lg></Grid>
        </Grid>
        </Box>
      </ThemeProvider>
    </>
  )
}

