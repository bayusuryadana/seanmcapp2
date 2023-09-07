import { useNavigate } from "react-router-dom";
import { Container, Grid, Button } from "@mui/material";

export const Home = () => {

  const navigate = useNavigate()
  const routeChange = (path: string) => {
    navigate(path)
  }

  return (
    <div id="wrapper">
        <div id="home-container">
            <Container maxWidth="sm">
                <h1>SEANMCAPP</h1>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <Button variant="text"></Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="outlined" onClick={() => routeChange('/wallet')}>Wallet</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="outlined" onClick={() => routeChange('/mamen')}>Mamen</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="text"></Button>
                        </Grid>
                    </Grid>
            </Container>
        </div>
    </div>
  )
}
