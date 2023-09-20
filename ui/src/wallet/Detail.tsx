import { Title } from './Title';
import { WalletDetail } from './WalletModels';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { Fragment } from 'react';

interface DetailProps {
    rows: WalletDetail[]
    editHandler: (row: WalletDetail) => void
    deleteHandler: (id: number) => void
    createHandler: () => void
}

export const Detail = (props: DetailProps) => {

  return (
    <Fragment>
      <Grid container justifyContent={'space-between'}>
        <Grid item>
          <Title>Detail</Title>
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