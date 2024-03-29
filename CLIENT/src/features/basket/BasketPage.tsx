import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Button } from '@mui/material';
import { Add, Delete, Remove } from "@mui/icons-material";
import agent from "../../app/api/agent";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import BasketSummary from './BasketSummary';
import { getCurrency } from '../../app/util/util';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { removeItem, setBasket } from './basketSlice';

export default function BasketPage(){

    const {basket } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    const [status, setStatus] = useState({
        loading: false,
        name: ''
    });

    function handleAddItem(productId: string, name: string){
        setStatus({loading: true, name});
        agent.Basket.addItem(productId)
                    .then(basket => dispatch(setBasket(basket)))
                    .catch(error => console.log(error))
                    .finally(() => setStatus({loading: false, name:''}))
    }

    function handleRemoveItem(productId: string, name: string, quantity = 1){
        setStatus({loading: true, name});
        agent.Basket.removeItem(productId, quantity)
                    .then(() => dispatch(removeItem({productId, quantity})))
                    .catch(error => console.log(error))
                    .finally(() => setStatus({loading: false, name:''}))
    }

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
                                loading={status.loading && status.name === 'remove' + item.productId} 
                                onClick={() => handleRemoveItem(item.productId, 'remove' + item.productId)} 
                                color='error'>
                                <Remove />
                            </LoadingButton>
                                        {item.quantity}
                            <LoadingButton 
                            loading={status.loading && status.name === 'add' + item.productId} 
                            onClick={() => handleAddItem(item.productId, 'add' + item.productId)} 
                            color='secondary'>
                                <Add />
                            </LoadingButton>
                        </TableCell>
                        <TableCell align="center">{getCurrency(item.price * item.quantity)}</TableCell>
                        <TableCell align="right">
                            <LoadingButton 
                            loading={status.loading && status.name === 'delete' + item.productId} 
                            onClick={() => handleRemoveItem(item.productId, 'delete' + item.productId, item.quantity)}
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