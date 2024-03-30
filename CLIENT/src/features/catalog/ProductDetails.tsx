import { Typography, Grid, Divider, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from '../../errors/NotFound';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { Constants, getCurrency } from '../../app/util/util';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { addBasketItemAsync } from '../basket/basketSlice';
import { fetchProductAsync, productSelectors } from './catalogSlice';

export default function ProductDetails(){

    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const {id} = useParams<{id: string}>();
    const product = useAppSelector(state => productSelectors.selectById(state, id!));
    const {status: productStatus}  = useAppSelector(state => state.catalog);
    const item = basket?.items.find(i => i.productId === product?.id);

    function handleAddItem(productId: string){
        dispatch(addBasketItemAsync({productId}));
    }

    useEffect(() => {
        if(!product && id) dispatch(fetchProductAsync(id));
    }, [dispatch, id, item, product])

    if(productStatus.includes('pending')) return <LoadingComponent message='Product loading...'/>

    if(!product) return <NotFound />

    return(
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{mb:2}} />
                <Typography variant='h4' color='secondary'>{getCurrency(product.price)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <LoadingButton loading={status.includes(Constants.pendingAddItem + item?.productId)} onClick={() => handleAddItem(product.id)} component={Link} to='/basket' sx={{height: '55px'}} color='primary' size='large' variant='contained' fullWidth>
                            {item ? 'Add 1 more' : 'Add to Cart'}
                    </LoadingButton>
                </TableContainer>
            </Grid>
        </Grid>
    )
}