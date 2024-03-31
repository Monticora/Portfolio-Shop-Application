import { TextField, debounce } from '@mui/material';
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from 'react';

export default function ProductSearch() {

    const {productParams} = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(productParams.search);
    const dispatch = useAppDispatch();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debuouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({search: event.target.value}))
    }, 1000);

    return(
        <TextField 
            label='Search products' 
            variant='outlined' 
            fullWidth 
            value={searchTerm || ''} 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
                debuouncedSearch(event);
            }}
        />  
    )
}