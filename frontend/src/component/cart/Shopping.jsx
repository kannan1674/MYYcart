import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux'
import { countries } from 'countries-list'

import { shippingDetails } from '../../slices/cartSlice';
import CheckoutSteps from './CheckoutSteps';
import MetaData from '../layout/MetaData';


export const validateShipping=(shippingInfo,navigate)=>{
    if(!shippingInfo.address||!shippingInfo.city||
        !shippingInfo.phoneNo||!shippingInfo.postalCode||
        !shippingInfo.state||!shippingInfo.country){
            toast.error('Please Fill the Shipping Details')
            navigate('/shipping')
        }
}

const Shipping = ({ isAuthenticated }) => {
    const { shippingInfo } = useSelector((state) => state.cartState);
    const navigate = useNavigate();

    // Provide default values if shippingInfo is undefined or missing properties
    const [address, setAddress] = useState(shippingInfo?.address ?? '');
    const [city, setCity] = useState(shippingInfo?.city ?? '');
    const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo ?? '');
    const [postalCode, setpostalCode] = useState(shippingInfo?.postalCode ?? '');
    const [country, setCountry] = useState(shippingInfo?.country ?? '');
    const [state, setState] = useState(shippingInfo?.state ?? '');
    const countryList = Object.values(countries);
    const dispatch = useDispatch()

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(shippingDetails({ address, city, phoneNo, postalCode, country, state }));
        navigate('/order/confirm')
    }

    return (
        <div>
            <MetaData title={'shipping'}/>
            <CheckoutSteps shipping/>

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postalCode_field">Postal Code</label>
                            <input
                                type="number"
                                id="postalCode_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e) => setpostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state_field">State</label>
                            <input
                                type="text"
                                id="state_field"
                                className="form-control"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select a country
                                </option>
                                {countryList.map((country, i) => (
                                    <option key={i} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;



