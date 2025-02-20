import React, { Fragment, useEffect, useState } from 'react'
import MetaData from '../layout/MetaData'
import { login } from '../../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearError } from '../../slices/authSlice'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();


    const { loading, error, isAuthenticated } = useSelector(state => state.authState)
    const redirect  = location.search?'/'+location.search.split('=')[1]:'/'
    

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect)
            //toast.success('User Login Successfully',{onClose:()=>{dispatch(clearError())}})
        }

        if (error) {
            toast.error(error,{
                onOpen:()=>{dispatch(clearError())}
            })

        }
    }, [error, loading, isAuthenticated])

    return (
        <Fragment>
            <MetaData title={`login`} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">Login</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <Link to={'/password/forgotPassword'} className="float-right mb-4">Forgot Password?</Link>

                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            LOGIN
                        </button>
                        <Link to={'/register'}>
                            <a className="float-right mt-3">New User?</a>
                        </Link>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Login
