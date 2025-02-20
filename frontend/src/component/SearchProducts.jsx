import React, { useEffect, useState } from 'react';
import MetaData from './layout/MetaData';
import { getProducts } from '../actions/productsActions';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Tooltip from 'rc-tooltip'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import "rc-tooltip/assets/bootstrap.css";


const SearchProducts = ({ title }) => {
    const { products, error, count, resPerPage } = useSelector((state) => state.productsState);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1000]);
    const [priceChanged, setPriceChanged] = useState([1, 1000]);
    const [category, setCategory] = useState(null);
    const [rating, setRating] = useState(0);
    const { keyword } = useParams();
    const Categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        dispatch(getProducts(keyword, price, category, rating, currentPage));
    }, [dispatch, keyword, priceChanged, category, rating, currentPage, error]);

    return (
        <div>
            <MetaData title={`${keyword}`} />
            <h1 id="products_heading">Search Products</h1>
            <section id="products" className="container mt-5">
                <div className="row">
                    <div className="col-6 col-md-3 mb-5 mt-5">
                        <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                            <Slider
                                range={true}
                                marks={
                                    {
                                        1: "$1",
                                        1000: "$1000"
                                    }
                                }
                                min={1}
                                max={1000}
                                defaultValue={[1, 1000]}
                                onChange={(price) => {
                                    setPrice(price)
                                }

                                }
                                handleRender={
                                    renderProps => {
                                        return <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                            <div {...renderProps.props}>

                                            </div>
                                        </Tooltip>
                                    }
                                }
                            />
                        </div>
                        {/* Category Filter */}
                        <hr className='my-5' />
                        <div className="mt-5">
                            <h3>Category</h3>
                            <ul className="pl-0">
                                {Categories.map(category =>

                                    <li style={{
                                        cursor: "pointer",
                                        listStyleType: "none"
                                    }} key={category}
                                        onClick={() => {
                                            setCategory(category)
                                        }}
                                    >
                                        {category}
                                    </li>
                                )}
                            </ul>
                        </div>
                        {/* Ratings Filter */}
                        <hr className='my-5' />
                        <div className="mt5">
                            <h4 className='mb-3'>Ratings</h4>
                            <ul className="pl-0">
                                {[5,4,3,2,1].map(star =>

                                    <li style={{
                                        cursor: "pointer",
                                        listStyleType: "none"
                                    }} key={star}
                                        onClick={() => {
                                            setRating(star)
                                        }}
                                    >
                                       <div className='rating-outer'>
                                        <div className="rating-inner"
                                            style={{width:`${star*20}%`}}
                                        >

                                        </div>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="col-6 col-md-9 ">
                        <div className="row">

                            {products && products.map(product => (
                                <div className="col-sm-12 col-md-6 col-lg-4 my-3" key={product._id}>
                                    <div className="card p-3 rounded">
                                        <img
                                            className="card-img-top mx-auto"
                                            src={product.images[0].image}
                                            alt={product.name}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">
                                                <Link to={`/product/${product._id}`}>{product.name}</Link>
                                            </h5>
                                            <div className="ratings mt-auto">
                                                <div className="rating-outer">
                                                    <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                                                </div>
                                                <span id="no_of_reviews">{product.numOfReviews}</span>
                                            </div>
                                            <p className="card-text">${product.price}</p>
                                            <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {count > 0 && count > resPerPage ? (
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

export default SearchProducts;
