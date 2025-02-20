import React, { useEffect, useState } from 'react';
import MetaData from './layout/MetaData';
import { getProducts } from '../actions/productsActions';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';

const Home = ({ title }) => {
    const { products, error, count, resPerPage } = useSelector((state) => state.productsState);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);

   
    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        dispatch(getProducts(null,null,null,null,currentPage)); 
    }, [dispatch, currentPage, error]);  

    return (
        <div>
            <MetaData title={'Home'} />
            <h1 id="products_heading">Latest Products</h1>
            <section id="products" className="container mt-5">
                <div className="row">
                    
                    {products && products.map(product => (
                        <div className="col-sm-12 col-md-6 col-lg-3 my-3" key={product._id}>
                            <div className="card p-3 rounded">
                                <img
                                    className="card-img-top mx-auto"
                                    src={product.images[0].image}
                                    alt={product.name}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">
                                        <Link to={`product/${product._id}`}>{product.name}</Link>
                                    </h5>
                                    <div className="ratings mt-auto">
                                        <div className="rating-outer">
                                            <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                                        </div>
                                        <span id="no_of_reviews">{product.numOfReviews}</span>
                                    </div>
                                    <p className="card-text">${product.price}</p>
                                    <Link to={`product/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {count > 0 && count>resPerPage ? (
                <div className='d-flex justify-content-center'>
                    <Pagination
                        activePage={currentPage}
                        onChange={setCurrentPageNo}
                        totalItemsCount={count}
                        itemsCountPerPage={resPerPage}
                        firstPageText={'FirstPage'}
                        lastPageText={'LastPage'}
                        itemClass={'page-item'}
                        linkClass={'page-link'}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default Home;
