import axios from 'axios';
import { createReviewFail, createReviewRequest, createReviewSuccess, productFail, productRequest, productSuccess } from '../slices/productSlice';

export const getProduct = id => {
    return async (dispatch) => { 
        try {
            dispatch(productRequest());  
            const { data } = await axios.get(`http://localhost:8000/api/product/${id}`);  
            dispatch(productSuccess(data));  
        } catch (error) {
            dispatch(productFail(error.response ? error.response.data.message : 'Something went wrong'));  
        }
    };
};

export const createReviews = (reviewData) => {
    return async (dispatch) => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return dispatch(createReviewFail('Authentication token is missing.'));
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
  
      try {
        dispatch(createReviewRequest());
        const { data } = await axios.put(
          `http://localhost:8000/api/review/create`,
          reviewData, // Ensure this is passed as the request body
          config
        );
        dispatch(createReviewSuccess(data));
      } catch (error) {
        dispatch(
          createReviewFail(
            error.response ? error.response.data.message : 'Something went wrong'
          )
        );
      }
    };
  };
  
