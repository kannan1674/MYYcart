import React, { useEffect, useState } from 'react'
import { register } from '../../actions/userActions'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearError } from '../../slices/authSlice';
import { Navigate, useNavigate } from 'react-router-dom';

const Register = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading,isAuthenticated } = useSelector(state => state.authState)

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [avatar, setAvatar] = useState("")
  const [avatarView, setAvatarView] = useState('/images/images.png')

  const submitHandler = (e) => {
    e.preventDefault(); 
    const formData = new FormData();
    formData.append('name',userData.name)
    formData.append('email',userData.email)
    formData.append('password',userData.password)
    formData.append('avatar',avatar)
    dispatch(register(formData))
  }

  useEffect(() => {
    if(isAuthenticated){
      navigate('/')
    }
    if (error) {
      toast.error(error, {
        onOpen: () => { dispatch(clearError()) }
      })
    }
    return

  }, [error, loading])

  const onChange = (e) => {
    if (e.target.name == 'avatar') {
      const reader = new FileReader;
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarView(reader.result)
          setAvatar(e.target.files[0])
        }
      }

      reader.readAsDataURL(e.target.files[0])
    } else {

      setUserData({ ...userData, [e.target.name]: e.target.value })
    }
  }
  return (
    <div>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data' >
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input type="name" id="name_field" className="form-control" name='name' onChange={onChange} />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input type="email" id="email_field" className="form-control" name='email' onChange={onChange} />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input type="password" id="password_field" className="form-control" name='password' onChange={onChange} />
            </div>

            <div className='form-group'>
              <label htmlFor='avatar_upload'>Avatar</label>
              <div className='d-flex align-items-center'>
                <div>
                  <figure className='avatar mr-3 item-rtl'>
                    <img src={avatarView} className='rounded-circle' alt='image' />
                  </figure>
                </div>
                <div className='custom-file'>
                  <input type='file' name='avatar' className='custom-file-input' id='customFile' onChange={onChange} />
                  <label className='custom-file-label' htmlFor='customFile'>
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button id="register_button" type="submit" className="btn btn-block py-3" disabled={loading}>
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
