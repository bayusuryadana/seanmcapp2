import { Autocomplete, Box, CssBaseline, Grid, TextField, ThemeProvider } from "@mui/material"
import { defaultTheme } from "./constant"
import { MamenMap } from "./MamenMap";
import { useEffect, useState } from "react";
import axios from "axios";
import { SeanmcappResponse } from "../CommonModels";

export const Mamen = () => {

  const [cities, setCities] = useState<{label: string, id: number, lat: number, lng: number}[]>([])
  const [center, setCenter] = useState<{lat: number, lng: number}>({lat: -6.173724660823213, lng: 106.8260522541504})

  useEffect(() => {
    axios.get('api/city-list')
    .then((res) => {
      const response: SeanmcappResponse<City[]> = res.data
      setCities(response.data.map((city) => {return {label: city.name, id: city.id, lat: city.latitude, lng: city.longitude}}))
    })
    .catch((err) => {console.log(err)})
  }, [])

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
          <Grid item xs></Grid>
          <Grid item xs={12}>
            <Box p={3}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={cities}
                sx={{ width: 300, backgroundColor: 'white'}}
                renderInput={(params) => <TextField {...params} label="Cities" />}
                onChange={(_, value) => {setCenter({lat: value?.lat ?? 0, lng: value?.lng ?? 0})}}
              />
            </Box>
            <Box p={3}>
              <MamenMap center={center} zoom={13}/>
            </Box>
          </Grid>
          <Grid item xs></Grid>
        </Grid>
        </Box>
      </ThemeProvider>
    </>
  )
}

type City = {
  id: number
  name: string
  latitude: number
  longitude: number
}