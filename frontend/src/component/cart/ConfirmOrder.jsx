import React, { useEffect } from 'react'
import { validateShipping } from './Shopping'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'



const ConfirmOrder = () => {
   const {shippingInfo,items:cartItems} = useSelector((state)=>state.cartState)
   const {user} = useSelector((state)=>state.authState)
   const itemPrice = parseFloat(cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0).toFixed(2));
   const shippingPrice = itemPrice>300?0:20;
   let taxPrice = parseFloat((0.18 * itemPrice).toFixed(2));
    const totalPrice = parseFloat((itemPrice + shippingPrice + taxPrice).toFixed(2));
   


    const processPayment=()=>{
        const data={
            itemPrice,
            shippingPrice,taxPrice,totalPrice
        }
        sessionStorage.setItem('orderInfo',JSON.stringify(data))
        navigate('/payment')
    }

   const navigate = useNavigate()
    useEffect(()=>{
        validateShipping(shippingInfo,navigate)
    },[])
  return (
    <div>
       
        <MetaData title={'ConfirmOrder'} />
        <CheckoutSteps shipping confirmOrder/>
        <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-confirm">

                <h4 className="mb-3">Shipping Info</h4>
                <p><b>Name:</b> {user.name}</p>
                <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                <p className="mb-4"><b>Address:</b> {shippingInfo.address},{shippingInfo.city},{shippingInfo.postalCode},{shippingInfo.state},{shippingInfo.country}</p>
                
                <hr />
                <h4 className="mt-4">Your Cart Items:</h4>
            {cartItems.map(item=>(
                <div key={item.id}>
                     <hr />
                <div className="cart-item my-1">
                    <div className="row">
                        <div className="col-4 col-lg-2">
                            <img src={item.image} alt={item.name} height="45" width="65"/>
                        </div>

                        <div className="col-5 col-lg-6">
                            <a href="#">{item.name}</a>
                        </div>


                        <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                            <p>{item.quantity} x ${item.price} = <b>${item.quantity * item.price}</b></p>
                        </div>

                    </div>
                </div>
                </div>
            ))}
               
                <hr />

            </div>
			
			<div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>itemPrice:  <span className="order-summary-values">${itemPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />
                        <button id="checkout_btn" onClick={processPayment} className="btn btn-primary btn-block">Proceed to Payment</button>
                    </div>
                </div>
			
			
        </div>
    </div>
  )
}

export default ConfirmOrder
