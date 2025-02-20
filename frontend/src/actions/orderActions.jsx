import { createOrderFail, createOrderRequest, createOrderSuccess, orderDeatilFail, orderDetailRequest, orderDetailSuccess, userOrdersFail, userOrdersRequest, userOrdersSuccess } from "../slices/orderSlice";
import axios from 'axios';

export const createOrder = order => async(dispatch) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return dispatch(createOrderFail('Authentication token is missing.'));
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };

  try {
    dispatch(createOrderRequest());
    const { data } = await axios.post(`http://localhost:8000/api/order/new`, order, config);
    dispatch(createOrderSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(createOrderFail(errorMessage));
  }
};

export const userOrderDetails = id => async(dispatch)=>{
  const token = localStorage.getItem('authToken');
  if (!token) {
    return dispatch(orderDeatilFail('Authentication token is missing.'));
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
  try {
    dispatch(orderDetailRequest())
    const {data} = await axios.get(`http://localhost:8000/api/order/getorder/${id}`,config)
    dispatch(orderDetailSuccess(data));
    
    
  } catch (error) {
    dispatch(orderDeatilFail(error.response.data.message))
  }
}

export const userOrdersDetails = async(dispatch)=>{
  const token = localStorage.getItem('authToken');
  if (!token) {
    return dispatch(createOrderFail('Authentication token is missing.'));
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
  try {
    dispatch(userOrdersRequest())
    const {data} = await axios.get(`http://localhost:8000/api/order/myorder`,config)
    dispatch(userOrdersSuccess(data));
    
    
  } catch (error) {
    dispatch(userOrdersFail(error.response.data.message))
  }
}