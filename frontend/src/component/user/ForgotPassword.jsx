import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { forgotUserPassword } from '../../actions/userActions'
const ForgotPassword = () => {
  const[email,setEmail]=  useState("")
  const{loading,error,message}=  useSelector(state=>state.authState)
  const dispatch = useDispatch()

  const submitHandler=(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append('email',email)
    dispatch(forgotUserPassword(formData))
  }

  useEffect(()=>{
    if(message){
        toast.success(message)
        setEmail("")
    }
    if(error){
        toast.error(error)
    }
  },[message,error,dispatch])
  return (
    <div>
      <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={e=>setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3">
                            Send Email
                    </button>

                    </form>
                </div>
            </div>
    </div>
  )
}

export default ForgotPassword
