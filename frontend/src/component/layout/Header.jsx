import React from 'react'
import Search from '../Search'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DropdownButton, Dropdown, Image } from 'react-bootstrap'
import { logout } from '../../actions/userActions'

const Header = () => {
    const { isAuthenticated, user } = useSelector(state => state.authState)
    const { items: cartItems } = useSelector(state => state.cartState)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {

        dispatch(logout)
    }

    return (

        <nav className="navbar row">
            <div className="col-12 col-md-3">
                <div className="navbar-brand">
                    <Link to='/'>
                        <img width="150px" alt='mycart' src="./images/products/logo.png" />
                    </Link>
                </div>
            </div>

            <div className="col-12 col-md-6 mt-2 mt-md-0">
                <Search />
            </div>

            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                {isAuthenticated ? (
                    <Dropdown className='d-inline'>
                        <Dropdown.Toggle variant='default text-white pr-5' id="dropdown-basic">
                            <figure className='avatar avatar-nav'>
                                <Image
                                    className="rounded-circle"
                                    width="50px"
                                    src={
                                        user && user.avatar
                                            ? `http://127.0.0.1:8000${user.avatar}`
                                            : './images.png'
                                    }
                                />

                            </figure>
                            <span>{user && user.name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {user.role == 'admin' && <Dropdown.Item className='text-dark' onClick={() => (navigate('admin/dashboard'))}>Dashboard</Dropdown.Item>}
                            <Dropdown.Item className='text-dark' onClick={() => (navigate('/myprofile'))}>Profile</Dropdown.Item>
                            <Dropdown.Item className='text-dark' onClick={() => (navigate('/order/myorders'))}>Orders</Dropdown.Item>
                            <Dropdown.Item className='text-danger' onClick={logoutHandler}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )
                    :
                    <Link to={'/login'}>
                        <button className="btn" id="login_btn">Login</button>
                    </Link>
                }

                <Link to='/cart'><span id="cart" className="ml-3">Cart</span></Link>
                <span className="ml-1" id="cart_count">{cartItems.length}</span>
            </div>
        </nav >

    )
}

export default Header
