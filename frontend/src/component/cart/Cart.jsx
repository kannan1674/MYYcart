import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { increaseCartQuantity, decreaseCartQuantity, deleteCartItems } from '../../slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const {isAuthenticated} = useSelector((state)=>state.authState)
    const { items } = useSelector((state) => state.cartState);
    const navigate = useNavigate();

    const increaseQuantity = (productId, stock) => {
        const item = items.find((item) => item.product === productId);
        if (item.quantity >= stock) return; 
        dispatch(increaseCartQuantity(productId));
    };

    const decreaseQuantity = (productId) => {
        const item = items.find((item) => item.product === productId);
        if (item.quantity <= 1) return; 
        dispatch(decreaseCartQuantity(productId));
    };

    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
    };

    const calculateUnits = () => {
        return items.reduce((acc, item) => acc + item.quantity, 0);
    };
    const checkOutHandler = () => {
        navigate('/login?redirect=shipping')
    };
    
    
     
    
    
    return (
        <div>
            {items.length === 0 ? (
                <h2 className="text-danger">Your Cart is Empty</h2>
            ) : (
                <>
                    <h2 className="mt-5">
                        Your Cart: <b>{items.length} item(s)</b>
                    </h2>
                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8">
                            {items.map((item) => (
                                <div key={item.product}>
                                    <hr />
                                    <div className="cart-item">
                                        <div className="row">
                                            <div className="col-4 col-lg-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    height="90"
                                                    width="115"
                                                />
                                            </div>

                                            <div className="col-5 col-lg-3">
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </div>

                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0 text-warning ">
                                                <p id="cart_item_price" style={{fontSize:'25px'}}>${item.price}</p>
                                            </div>

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <div className="stockCounter d-inline">
                                                    <button
                                                        onClick={() =>
                                                            decreaseQuantity(item.product)
                                                        }
                                                        className="btn btn-danger minus"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="form-control count d-inline"
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item.product,
                                                                item.stock
                                                            )
                                                        }
                                                        className="btn btn-primary plus"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                <i
                                                    id="delete_cart_item"
                                                    onClick={() =>
                                                        dispatch(deleteCartItems(item.product))
                                                    }
                                                    className="fa fa-trash btn btn-danger"
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>
                                    Subtotal:{" "}
                                    <span className="order-summary-values">
                                        {calculateUnits()} (Units)
                                    </span>
                                </p>
                                <p>
                                    Est. total:{" "}
                                    <span className="order-summary-values">
                                        ${calculateSubtotal()}
                                    </span>
                                </p>

                                <hr />
                                <p
                            
                                    id="checkout_btn"
                                    className="btn btn-primary btn-block"
                                    onClick={checkOutHandler}
                                >
                                    Check out
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
