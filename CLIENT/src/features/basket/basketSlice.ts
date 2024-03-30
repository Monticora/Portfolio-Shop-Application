import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";
import { Constants } from "../../app/util/util";

interface BasketState{
    basket: Basket | null;
    status: string;
}

const initialState: BasketState ={
    basket: null,
    status: Constants.idle
}

export const addBasketItemAsync = createAsyncThunk<Basket, {productId: string, quantity?: number}>(
    'basket/addBasketItemAsync',
    async ({productId, quantity = 1}, thunkAPI) => {
        try
        {
            return await agent.Basket.addItem(productId, quantity);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue({error});
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, {productId: string, quantity: number, name?: string}>(
    'basket/removeBasketItemAsync',
    async ({productId, quantity}, thunkAPI) => {
        try
        {
            return await agent.Basket.removeItem(productId, quantity);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue({error});
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.status = Constants.pendingAddItem + action.meta.arg.productId;
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = Constants.idle;
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            state.status = Constants.idle;
            console.log(action);
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = Constants.pendingRemoveItem + action.meta.arg.productId + action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            if(itemIndex === -1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity -= quantity;
            if(state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex, 1);
            state.status = Constants.idle;
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = Constants.idle;
            console.log(action.payload);
        });
    })
})

export const {setBasket} = basketSlice.actions;