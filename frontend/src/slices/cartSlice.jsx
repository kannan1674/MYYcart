import { createSlice } from '@reduxjs/toolkit';

const safeParse = (value, fallback = []) => {
    try {
        return JSON.parse(value) ?? fallback;
    } catch {
        return fallback;
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: safeParse(localStorage.getItem('cartItems'), []),
        loading: false,
        shippingInfo: safeParse(localStorage.getItem('shippingItems'), {
            address: '',
            city: '',
            phoneNo: '',
            pinCode: '',
            country: '',
            state: '',
        }),
    },
    
    reducers: {
        addCartItemRequest(state, action) {
            return {
                ...state,
                loading: false,
            };
        },
        addCartItemSuccess(state, action) {
            const item = action.payload;
            const itemExists = state.items.find((i) => i.product === item.product);

            if (itemExists) {
                // Update existing item
                state.items = state.items.map((i) =>
                    i.product === item.product ? { ...i, ...item } : i
                );
            } else {
                // Add new item
                state.items.push(item);
            }
            // Persist to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        increaseCartQuantity(state,action){
            state.items = state.items.map(item=>{
                if(item.product==action.payload){
                    item.quantity = item.quantity+1
                }
                return item
            })
            localStorage.setItem('cartItems',JSON.stringify(state.items))
        },
        decreaseCartQuantity(state,action){
            state.items = state.items.map(item=>{
                if(item.product==action.payload){
                    item.quantity = item.quantity-1
                }
                return item
            })
            localStorage.setItem('cartItems',JSON.stringify(state.items))
        },
        deleteCartItems(state,action){
            const filterdItems = state.items.filter(item=>{
                return item.product!==action.payload
            })
            localStorage.setItem('cartItems',JSON.stringify(filterdItems))
            return{
                ...state,
                items:filterdItems
            }
        },
        shippingDetails(state,action){
            localStorage.setItem('shippingInfo',JSON.stringify(action.payload))
            return{
                ...state,
                shippingInfo:action.payload
            }
        },
        orderCompleted(state,action){
            localStorage.removeItem('shippingInfo')
            localStorage.removeItem('cartItems')
            sessionStorage.removeItem('orderInfo')
            return{
                loading:false,
                items:[],
                shippingInfo:{}

            }
        },

    },

});

const { actions, reducer } = cartSlice;
export const { addCartItemRequest, addCartItemSuccess,increaseCartQuantity,decreaseCartQuantity,deleteCartItems,shippingDetails,orderCompleted } = actions;
export default reducer;
