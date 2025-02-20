import { createSlice } from "@reduxjs/toolkit";


const orderSlice = createSlice({
    name:'Order',
     initialState:{
       orderDetail:{},
       userOrders:[]
      },
      
    reducers:{
        createOrderRequest(state,action){
            return{
                ...state,
                loading:false
            }
        },
        createOrderSuccess(state,action){
            return{
                ...state,
                loading:false,
                orderDetail:action.payload.order
            }
        },
        createOrderFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            }
        },
       userOrdersRequest(state,action){
     
            return{
                ...state,
                loading:false
            }
        },
        userOrdersSuccess(state=[],action){
            return{
                ...state,
                loading:false,
                userOrders:action.payload.myOrders
            }
        },
        userOrdersFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            }
        },
       orderDetailRequest(state,action){
     
            return{
                ...state,
                loading:false
            }
        },
        orderDetailSuccess(state={},action){
            return{
                ...state,
                loading:false,
                orderDetail:action.payload.order
            }
        },
        orderDeatilFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            }
        },
        clearOrderError(state,action){
            return{
                ...state,
                error:null

            }
        }
    }
})

const {actions,reducer} = orderSlice;
export const {createOrderRequest,createOrderSuccess,
    createOrderFail,clearOrderError,
userOrdersRequest,userOrdersSuccess,userOrdersFail,orderDetailRequest,orderDetailSuccess,orderDeatilFail} = actions;
export default reducer;