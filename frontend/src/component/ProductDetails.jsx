import React, { Fragment, useEffect } from 'react'
import { createReviews, getProduct } from '../actions/productActions'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { Carousel, Toast } from 'react-bootstrap'
import MetaData from './layout/MetaData';
import { useState } from 'react';
import { addToCart } from '../actions/cartActions';
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify';
import { clearReviewError,clearError } from '../slices/productSlice';
import ProductReview from './ProductReview';
const ProductDetails = () => {
    const { product={}, loading,isReviewed,error } = useSelector(state => state.productState);
    const { user} = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1)
    const [rating, setRating] = useState(1)
    const [comment, setComment] = useState('')
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const increaseQuantity = () => {
        const count = document.querySelector('.count')
        if (product.stock == 0 || count.valueAsNumber >= product.stock) return
        const qty = count.valueAsNumber + 1;
        setQuantity(qty)
    }

    const decreaseQuantity = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber == 1) return
        const qty = count.valueAsNumber - 1;
        setQuantity(qty)
    }

    useEffect(() => {

        if(isReviewed){
            handleClose()
            toast.success('Review Submitted Successfully',{
                onOpen:()=>dispatch(clearReviewError())
            })


            
        }



            dispatch(getProduct(id));
        
    }, [dispatch, id,isReviewed,error]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!product) {
        return <h2>Product not found!</h2>;
    }

    const reviewHandler =()=>{
        const formData = new FormData();
         formData.append('rating',rating),
         formData.append('comment',comment),
         formData.append('productId',id)
         dispatch(createReviews(formData))
    }

    return (
        <Fragment>
            <MetaData title={product.name} />
            <div className="container my-5">
                <div className="row d-flex align-items-start">
                    <div className="col-12 col-lg-5 text-center" id="product_image">
                        <Carousel pause="hover">
                            {product.images && product.images.map(image =>
                                <Carousel.Item key={image._id}>

                                    <img
                                        src={image.image}
                                        alt={product.name}
                                        className="img-fluid"
                                        height="500"
                                        width="500"
                                    />
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </div>


                    <div className="col-12 col-lg-5 mt-5">
                        <h3>{product.name}</h3>
                        <p id="product_id">Product # {product._id}</p>
                        <hr />
                        <div className="rating-outer">
                            <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews">({product.numOfReviews || 0} Reviews)</span>
                        <hr />
                        <p id="product_price">${product.price || "N/A"}</p>

                        <hr />
                        <div className="stockCounter d-inline">
                            <span className="btn btn-danger minus" onClick={decreaseQuantity}>-</span>

                            <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                            <span className="btn btn-primary plus" onClick={increaseQuantity}>+</span>
                        </div>
                        <button type="button" id="cart_btn" onClick={() => dispatch(addToCart(product._id, quantity))} disabled={product.stock == 0 ? true : false} className="btn btn-primary d-inline ml-4">Add to Cart</button>

                        <hr />

                        <p>Status: <span className={product.stock > 0 ? 'greenColor' : 'redColor'} id="stock_status">{product.stock > 0 ? 'In-stock' : 'Out of Stock'}</span></p>
                        <hr />
                        <h4 className="mt-2">Description:</h4>
                        <p>{product.description || "No description available."}</p>
                        <hr />
                        <p id="product_seller" className="mb-3">
                            Sold by: <strong>{product.seller || "Unknown"}</strong>
                        </p>
                        {user ?
                        <button onClick={handleShow} id="review_btn" type="button" class="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                            Submit Your Review
                        </button>:
                            <div className='alert alert-danger'>Login for Review </div>
                        }
                        <div className='row mt-2 mb-5'>
                            <div className="rating w-50">
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Submit Review</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body> <ul class="stars" >
                                        {
                                            [1,2,3,4,5].map(star=>(

                                                <li 
                                                    value={star}
                                                    onClick={()=>setRating(star)}
                                                    className={`star ${star<=rating?'orange':''}`}
                                                    onMouseOver={(e)=>e.target.classList.add('yellow')}
                                                    onMouseOut={(e)=>e.target.classList.remove('yellow')}

                                                ><i className="fa fa-star"></i></li>
                                            ))
                                        }
                                       
                                    </ul>

                                        <textarea onChange={(e)=>setComment(e.target.value)} name="review" id="review" className="form-control mt-3">

                                        </textarea>

                                        <button disabled={loading} onClick={reviewHandler} className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                                </Modal.Body>
                                <Modal.Footer>

                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>

            </div>
            <ProductReview reviews={product.reviews}/>
        </div>
               
        </Fragment >
    );
};

export default ProductDetails;

