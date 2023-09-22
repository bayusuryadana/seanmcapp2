import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { useCallback, useState } from "react";
import { SeanmcappResponse } from "../common";
import { Divider, Fab, Grid, IconButton, Typography } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import PlaceIcon from '@mui/icons-material/Place';
import MyLocationIcon from '@mui/icons-material/MyLocation';

export const MamenMap = ({
  center,
  zoom,
}: {
  center: { lat: number, lng: number}
  zoom: number
}) => {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
  })

  const [map, setMap] = useState<google.maps.Map|null>(null)
  const [stalls, setStalls] = useState<Stall[]>([])
  const [infoWindow, setInfoWindow] = useState<Stall|null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const onChangeHandler = async () => {
    const bounds = map?.getBounds()
    const nw = {
      lat: bounds?.getNorthEast().lat() ?? 0,
      lng: bounds?.getSouthWest().lng() ?? 0
    }
    const se = {
      lat: bounds?.getSouthWest().lat() ?? 0,
      lng: bounds?.getNorthEast().lng() ??0
    }
    
    await axios.post('api/mamen', {
      filter: {
        geo: {
          nw: nw,
          se: se
        }
      }
    })
    .then((responseObj) => {
      const response: SeanmcappResponse<Stall[]> = responseObj.data
      setStalls(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const onMyLocationHandler = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      map?.setCenter({lat, lng})
    }, (err) => {console.log(err)})
  }

  const renderInfoWindow = () => {
    return (
      <InfoWindow onCloseClick={() => {setInfoWindow(null)}}>
        <Grid container justifyContent={'space-between'} p={1}>
          <Grid item sx={{display: 'flex', alignItems: 'center'}}>
            <Typography>{infoWindow?.name}</Typography>
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ml: 2, mr: 2}}/>
          <Grid item>
            <IconButton aria-label="youtube" size="small" onClick={() => window.open(infoWindow?.youtube_url)}>
              <YouTubeIcon sx={{color: 'red'}}/>
            </IconButton>
            <IconButton aria-label="gmaps" size="small" onClick={() => window.open(infoWindow?.gmaps_url)}>
              <PlaceIcon sx={{color: '#1976d2'}}/>
            </IconButton>
          </Grid>
        </Grid>
      </InfoWindow>
    )
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{height: '60vh'}}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onIdle={onChangeHandler}
      onClick={() => setInfoWindow(null)}
    >
      <Fab color="primary" aria-label="my-location" sx={{position: 'absolute', bottom: 32, left: 32}} onClick={onMyLocationHandler}>
        <MyLocationIcon />
      </Fab>
      {stalls.map((stall) => (
        <Marker key={stall.id} position={{lat: stall.latitude, lng: stall.longitude}} onClick={() => {setInfoWindow(stall)}}>
          {infoWindow?.id === stall.id && renderInfoWindow()}
        </Marker>
      ))}
      
    </GoogleMap>
  ) : <></>

}

export type Stall = {
  id: number
  name: string
  gmaps_url: string
  youtube_url: string
  latitude: number
  longitude: number
}