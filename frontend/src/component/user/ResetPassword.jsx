import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { resetUserPassword } from '../../actions/userActions'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const {isAuthenticated,error} = useSelector(state=>state.authState)
    const[password,setPassword]=useState('')
    const[confirmPassword,setConfirmPassword]=useState('')
    const dispatch = useDispatch();
    const {token} = useParams();
    const navigate = useNavigate();

    const submitHandler=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('password',password)
        formData.append('confirmPassword',confirmPassword)
        dispatch(resetUserPassword(formData,token))
    }

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/login')
            toast.success('Reset Password Successfully')
        }
        if(error){
            toast.error(error)
        }
    },[isAuthenticated,error,dispatch])
  return (
    <div>
      <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-3">New Password</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={confirmPassword}
                            onChange={e=>setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Set Password
                    </button>

                </form>
            </div>
        </div>
    </div>
  )
}

export default ResetPassword
