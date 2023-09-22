import { Container, Alert, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Badge, Tooltip, TableContainer } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { WalletAlert, WalletPortoData, WalletStock } from "./model"
import { UserContext, UserContextType } from "./UserContext"
import axios from "axios"
import { SeanmcappResponse } from "../common"

export const WalletPorto = () => {

  const { userContext } = useContext(UserContext) as UserContextType
  const [alert, setAlert] = useState<WalletAlert>({display: 'none', text: ''})
  const [data, setData] = useState<WalletPortoData|null>(null);

  const getWalletPorto = () => {
    axios.get('./../api/wallet/porto', {
      auth: {
        username: 'bayu',
        password: userContext ?? ""
      }
    })
    .then((response) => {
      setAlert({display: 'none', text: ''})
      const apiData: SeanmcappResponse<WalletPortoData> = response.data
      console.log(apiData)
      setData(apiData.data)
    })
    .catch((error) => {
      console.log(error)
      setAlert({display: 'true', text: 'Data failed to fetch/parse!'})
    })
  }

  const renderBadge = (row: WalletStock) => {
    if (row.eip_best_buy || row.eip_rating || row.eip_risks) {
      const titleContent = [
        "Best Buy: "+row.eip_best_buy,
        <br />,
        "Rating: "+row.eip_rating,
        <br />,
        "Risks: "+row.eip_risks,
      ]
      return (
        <Tooltip title={<span>{titleContent}</span>} placement="right-start">
          <Badge color="secondary" variant="dot">
            {row.id}
          </Badge>
        </Tooltip>
      )
    } else {
      return row.id
    }
  }

  useEffect(() => {
    getWalletPorto()
  }, [])

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert id="invalid-data-alert" severity="error" sx={{ mb: 2, display: alert.display}}>{alert.text}</Alert>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column',}}>
              <TableContainer sx={{ height: '60vh' }}>
                <Table size="small" stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Share</TableCell>
                      <TableCell align="right">Liability</TableCell>
                      <TableCell align="right">Equity</TableCell>
                      <TableCell align="right">Curr. Profit</TableCell>
                      <TableCell align="right">Prev. Profit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.stocks.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {renderBadge(row)}
                        </TableCell>
                        <TableCell align="right">{row.current_price}</TableCell>
                        <TableCell align="right">{row.share}</TableCell>
                        <TableCell align="right">{row.liability}</TableCell>
                        <TableCell align="right">{row.equity}</TableCell>
                        <TableCell align="right">{row.net_profit_current_year}</TableCell>
                        <TableCell align="right">{row.net_profit_previous_year}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}