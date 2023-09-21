interface MamenMarkerProps {
  text: string
  lat: number
  lng: number
}

export const MamenMarker = (props: MamenMarkerProps) => {
  return(
    <div>{props.text}</div>
  )
}