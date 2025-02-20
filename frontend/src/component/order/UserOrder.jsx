import React, { useEffect } from 'react';
import MetaData from '../layout/MetaData';
import { MDBDataTable } from 'mdbreact';
import { useDispatch, useSelector } from 'react-redux';
import { userOrdersDetails } from '../../actions/orderActions';
import { Link } from 'react-router-dom';

const UserOrder = () => {
  const { userOrders = [] } = useSelector(state => state.orderState);
  console.log(userOrders);
  
  const dispatch = useDispatch();

  useEffect(() => {
  
    dispatch(userOrdersDetails);
  }, [dispatch]);

  const setOrders = () => {
    const data = {
      columns: [
        { label: 'Order ID', field: 'id', sort: 'asc' },
        { label: 'No of Items', field: 'noofitems', sort: 'asc' },
        { label: 'Amount', field: 'amount', sort: 'asc' },
        { label: 'Status', field: 'status', sort: 'asc' },
        { label: 'Actions', field: 'actions', sort: 'asc' },
      ],
      rows: [],
    };

    userOrders.forEach(userOrder => {
      data.rows.push({
        id: userOrder._id,
        noofitems: userOrder.orderItems.length,
        amount: `$${userOrder.totalPrice}`,
        status: (
          <p style={{ color: userOrder.orderStatus === 'delivered' ? 'green' : 'red' }}>
            {userOrder.orderStatus}
          </p>
        ),
        actions: 
          <Link to={`/order/${userOrder._id}`} className='btn btn-primary'>
            <i className='fa fa-eye' ></i>
          </Link>
        
      });
    });
   
    
    return data;
  };

  return (
    
    <div>
        
      <MetaData title={'My Orders'} />
      
      <h1 className='mt-5'>My Orders</h1>
   
      
      <MDBDataTable className='px-3' bordered striped hover data={setOrders()} />
    </div>
  );
};

export default UserOrder;
