import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { getCurrency } from '../../app/util/util';
import { useAppDispatch } from '../../app/store/configureStore';
import { setBasket } from '../basket/basketSlice';

interface Props{
    product: Product;
}

export default function ProductCard({product}: Props){

    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    function handleAddItem(productId: string){
        setLoading(true);
        agent.Basket.addItem(productId)
                    .then(basket => dispatch(setBasket(basket)))
                    .catch(error => console.log(error))
                    .finally(() => setLoading(false));
    }

    return(
        <Card>
            <CardHeader 
            avatar=
            {
                <Avatar sx={{bgcolor: 'secondary.main'}}>
                    {product.name.charAt(0).toUpperCase()}
                </Avatar>
            } 
            title={product.name}
            titleTypographyProps={{
                sx: {fontWeight: 'bold', color: 'secondary.main'}
            }}
            >
            </CardHeader>

            <CardMedia sx={{ height: 140, backgroundSize: 'contain', bgcolor:'secondary.main'}}image={product.pictureUrl} title={product.name}/>

            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5">
                    {getCurrency(product.price)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>

            <CardActions>

                <LoadingButton 
                    loading={loading}
                    onClick={() => handleAddItem(product.id)} 
                    size="small"
                >
                    Add to cart
                </LoadingButton>

                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
                
            </CardActions>
      </Card>
    )
}