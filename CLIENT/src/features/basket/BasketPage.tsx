import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Button } from '@mui/material';
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import BasketSummary from './BasketSummary';
import { Constants, getCurrency } from '../../app/util/util';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { removeBasketItemAsync, addBasketItemAsync } from './basketSlice';

export default function BasketPage(){

    const {basket, status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    if(!basket) return <Typography variant="h3">Your basket is empy</Typography>

    return(
    <>
        <TableContainer component={Paper}>
           
            <Table sx={{ minWidth: 650 }}>
                
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Subtotal</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                {basket.items.map(item => (
                    <TableRow
                    key={item.productId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            <Box display='flex' alignItems='center'>
                                <img src={item.pictureUrl} alt={item.name} style={{height:50, marginRight: 20}} />
                                <span>{item.name}</span>
                            </Box>
                        </TableCell>
                        <TableCell align="center">{getCurrency(item.price)}</TableCell>
                        <TableCell align="center">
                            <LoadingButton 
                                loading={status === Constants.pendingRemoveItem + item.productId + 'remove'} 
                                onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: 1, name: 'remove'}))} 
                                color='error'>
                                <Remove />
                            </LoadingButton>
                                        {item.quantity}
                            <LoadingButton 
                            loading={status === Constants.pendingAddItem + item.productId} 
                            onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))}  
                            color='secondary'>
                                <Add />
                            </LoadingButton>
                        </TableCell>
                        <TableCell align="center">{getCurrency(item.price * item.quantity)}</TableCell>
                        <TableCell align="right">
                            <LoadingButton 
                            loading={status === Constants.pendingRemoveItem + item.productId + 'delete'} 
                            onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: item.quantity, name: 'delete'}))}
                            color='error'>
                                <Delete />
                            </LoadingButton>    
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>

        <Grid container>
            <Grid item xs={6} />
            <Grid item xs={6}>
                <BasketSummary />
                <Button component={Link} to='/checkout' variant='contained' size='large' fullWidth>Checkout</Button>
            </Grid>
        </Grid>
    </>
    )
}