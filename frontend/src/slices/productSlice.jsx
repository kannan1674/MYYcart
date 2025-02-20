import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
    name:"Product",
    initialState:{
        loading:false,
        product:null,
        isReviewed:false
        
    },
    reducers:{
        productRequest(state,action){
            return{
                ...state,
                loading:true
            };
        },
        productSuccess(state,action){
            return{
                ...state,
                loading:false,
                product:action.payload.product
            };
        },
        productFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            };
        },
        createReviewRequest(state,action){
            return{
                ...state,
                loading:true
            };
        },
        createReviewSuccess(state,action){
            return{
                ...state,
                loading:false,
                isReviewed:true
               
            };
        },
        clearReviewSubmitted(state,action){
            return{
                ...state,
                isReviewed:false
               
            };
        },
        createReviewFail(state,action){
            return{
                loading:false,
                error:action.payload
            };
        },
        clearReviewError(state,action){
            return{
                loading:false,
                error:null
            };
        },
        clearError(state,action){
            return{
                loading:false,
                error:null
            };
        },
    }
})

const {actions,reducer} = productSlice;
export const{productRequest,productSuccess,productFail,clearError,createReviewRequest,createReviewSuccess,createReviewFail,clearReviewError} = actions;
export default reducer;