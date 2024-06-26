import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { getCurrency, Constants } from "../../app/util/util";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import { useAppSelector, useAppDispatch } from '../../app/store/configureStore';
import { BasketItem } from "../../app/models/basket";

interface Props{
    items: BasketItem[];
    isBasket?: boolean;
}

export default function BasketTable({items, isBasket = true} : Props){

    const {status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    return (
        <TableContainer component={Paper}>
           
        <Table sx={{ minWidth: 650 }}>
            
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Subtotal</TableCell>
                    { isBasket && <TableCell align="right"></TableCell>}
                </TableRow>
            </TableHead>

            <TableBody>
            {items.map(item => (
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
                        {isBasket && <LoadingButton 
                            loading={status === Constants.pendingRemoveItem + item.productId + 'remove'} 
                            onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: 1, name: 'remove'}))} 
                            color='error'>
                            <Remove />
                        </LoadingButton>}
                                    {item.quantity}
                        {isBasket && <LoadingButton 
                        loading={status === Constants.pendingAddItem + item.productId} 
                        onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))}  
                        color='secondary'>
                            <Add />
                        </LoadingButton>}
                    </TableCell>
                    <TableCell align="center">{getCurrency(item.price * item.quantity)}</TableCell>
                    {isBasket && <TableCell align="right">
                        <LoadingButton 
                        loading={status === Constants.pendingRemoveItem + item.productId + 'delete'} 
                        onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: item.quantity, name: 'delete'}))}
                        color='error'>
                            <Delete />
                        </LoadingButton>    
                    </TableCell>}
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer> 
    )
}