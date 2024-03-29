import { Typography, Grid, Divider, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from '../../app/api/agent';
import NotFound from '../../errors/NotFound';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { getCurrency } from '../../app/util/util';
import { useStoreContext } from '../../app/context/StoreContext';
import { LoadingButton } from '@mui/lab';

export default function ProductDetails(){

    const {basket, setBasket} = useStoreContext();
    const {id} = useParams<{id: string}>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const item = basket?.items.find(i => i.productId === product?.id);

    function handleAddItem(productId: string){
        setLoading(true);
        agent.Basket.addItem(productId)
                    .then(basket => setBasket(basket))
                    .catch(error => console.log(error))
                    .finally(() => setLoading(false));
    }

    useEffect(() => {
        id && agent.Catalog.details(id)
        .then(response => setProduct(response))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }, [id, item])

    if(loading) return <LoadingComponent message='Product loading...'/>

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
                    <LoadingButton onClick={() => handleAddItem(product.id)} component={Link} to='/basket' sx={{height: '55px'}} color='primary' size='large' variant='contained' fullWidth>
                            {item ? 'Add 1 more' : 'Add to Cart'}
                    </LoadingButton>
                </TableContainer>
            </Grid>
        </Grid>
    )
}