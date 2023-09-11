import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Title } from './Title';
import { WalletDetail } from './WalletModels';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface DetailProps {
    rows: WalletDetail[]
    createHandler: (row: WalletDetail) => void
    editHandler: (row: WalletDetail) => void
    deleteHandler: (id: number) => void
}

export const Detail = (props: DetailProps) => {

  return (
    <React.Fragment>
      <Title>Detail</Title>
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
    </React.Fragment>
  );
}