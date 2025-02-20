import React, { useEffect, useState } from 'react';
import MetaData from '../layout/MetaData';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { orderCompleted } from '../../slices/cartSlice';
import { createOrder } from '../../actions/orderActions';
import { clearOrderError } from '../../slices/orderSlice';
import { validateShipping } from './Shopping';
import CheckoutSteps from './CheckoutSteps';
const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const { user } = useSelector((state) => state.authState);
  const { items:cartItems,shippingInfo } = useSelector((state) => state.cartState);
  const { error: orderError } = useSelector((state) => state.orderState);

  

  const paymentData={
    amount: Math.round(orderInfo.totalPrice * 100),
    currency: 'usd', // or the appropriate currency code
    shipping: {
        name: user.name,
        address: {
            city: shippingInfo.city,
            postal_code: shippingInfo.postalCode, 
            state: shippingInfo.state,
            line1: shippingInfo.address,
            country: shippingInfo.country,
        },
        phone: shippingInfo?.phoneNo,
    },
   
};

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  if(orderInfo){
    order.itemPrice = orderInfo.itemPrice,
    order.shippingPrice = orderInfo.shippingPrice,
    order.taxPrice = orderInfo.taxPrice,
    order.totalPrice = orderInfo.totalPrice
  }

  useEffect(()=>{
    validateShipping(shippingInfo,navigate)
    if(orderError){
      toast(orderError,{
        type:'error',
        onOpen:()=>{dispatch(clearOrderError())}
      })
    }
  },[])

  const submitHandler = async (e) => {
    e.preventDefault();
  
    document.querySelector('#pay_btn').disabled = true;
    
    try {
      const { data } = await axios.post('http://localhost:8000/api/stripe/process', paymentData);
      const clientSecret = data.client_secret;
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });
  
      if (result.error) {
        toast(result.error.message, { type: 'error' });
        document.querySelector('#pay_btn').disabled = false;
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          toast('Payment Complete', { type: 'success' });
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(orderCompleted());
          dispatch(createOrder(order));
          navigate('/order/success');
        } else {
          toast('Please try again', { type: 'warning' });
        }
      }
    } catch (error) {
      toast('Something went wrong, please try again', { type: 'error' });
      console.error(error);
    } finally {
      
      document.querySelector('#pay_btn').disabled = false;
    }
  };
  
   
  

  return (
    <div>
      <MetaData title="Payment" />
      <CheckoutSteps shipping confirmOrder payment/>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement id="card_num_field" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement id="card_exp_field" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement id="card_cvc_field" className="form-control" />
            </div>
            <button id="pay_btn" type="submit" className="btn btn-block py-3" >
             Pay - {` $${orderInfo?.totalPrice || 0}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
