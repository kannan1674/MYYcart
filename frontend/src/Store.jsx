import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import productsReducers from './slices/productsSlices'
import productReducers from './slices/productSlice'
import authReducers from './slices/authSlice'
import cartReducers from './slices/cartSlice'
import orderReducers from './slices/orderSlice'

const reducer = combineReducers({
 
    productsState: productsReducers,
    productState: productReducers,
    authState:authReducers,
    cartState: cartReducers,
    orderState: orderReducers,

});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
