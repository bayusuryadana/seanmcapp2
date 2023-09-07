import { useNavigate } from "react-router-dom";
import { Container, Grid, Button } from "@mui/material";


function Home() {

  let navigate = useNavigate()
  const routeChange = () => { navigate('/wallet') }

  return (
    <>
        <Container maxWidth="sm">
            <p>SEANMCAPP</p>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Button variant="text"></Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="outlined" onClick={routeChange}>Wallet</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="outlined">Mamen</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="text"></Button>
                    </Grid>
                </Grid>
        </Container>
    </>
  )
}

export default Home
