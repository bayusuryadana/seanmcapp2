import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { useCallback, useState } from "react";
import { SeanmcappResponse } from "../CommonModels";
import { Box, Typography } from "@mui/material";

export const MamenMap = ({
  center,
  zoom,
}: {
  center: { lat: number, lng: number}
  zoom: number
}) => {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ''
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

  const getStalls = (nw: { lat: number, lng: number }, se: { lat: number, lng: number }) => {
    axios.post('api/mamen', {
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

  const onChangeHandler = () => {
    const bounds = map?.getBounds()
    const nw = {
      lat: bounds?.getNorthEast().lat() ?? 0,
      lng: bounds?.getSouthWest().lng() ?? 0
    }
    const se = {
      lat: bounds?.getSouthWest().lat() ?? 0,
      lng: bounds?.getNorthEast().lng() ??0
    }
    getStalls(nw, se)
  }

  const renderInfoWindow = () => {
    return (
      <InfoWindow onCloseClick={() => {setInfoWindow(null)}}>
        <Box m={2}>
          <Typography>{infoWindow?.youtube_url}</Typography>
          <Typography>{infoWindow?.gmaps_url}</Typography>
        </Box>
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
    >
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
  gmaps_url: string
  youtube_url: string
  latitude: number
  longitude: number
}