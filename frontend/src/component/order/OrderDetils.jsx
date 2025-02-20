import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { userOrderDetails } from '../../actions/orderActions';

const OrderDetails = () => {
  const { orderDetail } = useSelector((state) => state.orderState);
  const {
    user = {},
    shippingInfo = {},
    paymentInfo = {},
    orderItems = [],
    totalPrice = 0,
    orderStatus = 'Processing',
  } = orderDetail;
  const dispatch = useDispatch();
  const { id } = useParams();
  const isPaid = paymentInfo&&paymentInfo.status==='succeeded'?true:false

  useEffect(() => {
    if (id) {
      dispatch(userOrderDetails(id));
    }
  }, [id, dispatch]);

  return (
    <div>
      {orderDetail ? (
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-8 mt-5 order-details">
            <h1 className="my-5">Order {orderDetail._id || 'N/A'}</h1>

            <h4 className="mb-4">Shipping Info</h4>
            <p><b>Name:</b> {user.name || 'N/A'}</p>
            <p><b>Phone:</b> {shippingInfo.phoneNo || 'N/A'}</p>
            <p className="mb-4">
              <b>Address:</b> {`${shippingInfo.address || ''}, ${shippingInfo.city || ''}, ${shippingInfo.state || ''}, ${shippingInfo.country || ''}`}
            </p>
            <p><b>Amount:</b> ${totalPrice}</p>

            <hr />

            <h4 className="my-4">Payment</h4>
            <p className={isPaid?'greenColor':'redColor'}><b>{isPaid?'PAID':'NOT PAID'}</b></p>

            <h4 className="my-4">Order Status:</h4>
            <p className={orderStatus&&orderStatus.includes('delivered') ? 'greenColor' : 'redColor'}>
              <b>{orderStatus}</b>
            </p>

            <h4 className="my-4">Order Items:</h4>
            <hr />
            <div className="cart-item my-1">
              {orderItems.map((orderItem, index) => (
                <div className="row my-5" key={index}>
                  <div className="col-4 col-lg-2">
                    <img src={orderItem.image} alt={orderItem.name} height="45" width="65" />
                  </div>

                  <div className="col-5 col-lg-5">
                    <a href="#">{orderItem.name}</a>
                  </div>

                  <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                    <p>${orderItem.price}</p>
                  </div>

                  <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                    <p>{orderItem.quantity || 0} item(s)</p>
                  </div>
                </div>
              ))}
            </div>
            <hr />
          </div>
        </div>
      ) : (
        <h5>No Data</h5>
      )}
    </div>
  );
};

export default OrderDetails;
