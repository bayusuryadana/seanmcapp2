import { Title } from './Title';
import { WalletDetail } from './WalletModels';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Fragment } from 'react';

interface DetailProps {
    date: string
    rows: WalletDetail[]
    editHandler: (row: WalletDetail) => void
    deleteHandler: (id: number) => void
    createHandler: () => void
    updateDashboard: (date: string) => void
}

export const Detail = (props: DetailProps) => {

  const dateConverter = (year: number, month: number) => {
    if (month == 0) {
      return (year-1).toString() + '12'
    } else if (month == 13) {
      return (year+1).toString() + '01'
    } else {
      if (month < 10) {
        return year.toString() + '0' + month.toString()
      } else {
        return year.toString() + month.toString()
      }
    }
  }

  const prevMonth = (date: string) => {
    const year = parseInt(date.slice(0,4))
    const month = parseInt(date.slice(4, 6)) - 1
    const newDate = dateConverter(year, month)
    console.log(newDate)
    props.updateDashboard(newDate)
  }

  const nextMonth = (date: string) => {
    const year = parseInt(date.slice(0,4))
    const month = parseInt(date.slice(4, 6)) + 1
    const newDate = dateConverter(year, month)
    console.log(newDate)
    props.updateDashboard(newDate)
  }

  const convertTitle = (date: string) => {
    const monthString = date.slice(4, 6)
    const monthName = (() => {
      switch(monthString) { 
        case '01': return 'January'
        case '02': return 'February';
        case '03': return 'March';
        case '04': return 'April';
        case '05': return 'May';
        case '06': return 'June';
        case '07': return 'July';
        case '08': return 'August';
        case '09': return 'September';
        case '10': return 'October';
        case '11': return 'November';
        case '12': return 'December';
        default: return ''; 
      } 
    })()
    return monthName+' '+date.slice(0, 4)
  }

  return (
    <Fragment>
      <Grid container justifyContent={'space-between'}>
        <Grid item>
          <Title>Detail</Title>
        </Grid>
        <Grid item>
            <IconButton color='primary' size='medium' sx={{display: 'inline'}} onClick={() => prevMonth(props.date)}>
                <ArrowLeftIcon />
            </IconButton>
            <Title>{convertTitle(props.date)}</Title>
            <IconButton color='primary' size='medium' sx={{display: 'inline'}} onClick={() => nextMonth(props.date)}>
                <ArrowRightIcon />
            </IconButton>
        </Grid>
        <Grid item>
          <IconButton color='primary' size='small' onClick={props.createHandler}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Account</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow key={row.id}>
              {/* row.date */}
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.currency}</TableCell>
              <TableCell>{row.account}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell>
                <IconButton aria-label="edit" color="primary" onClick={()=>props.editHandler(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color="secondary" onClick={()=>props.deleteHandler(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}