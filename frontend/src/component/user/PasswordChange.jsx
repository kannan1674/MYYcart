import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPassword } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PasswordChange = () => {
    const {error, message } = useSelector((state) => state.authState);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    console.log('isUpdated:', message, 'error:', error); // Debugging
    if (message) {
      toast.success('Password updated successfully!', { type: 'success' });
     
    }
  
    if (error) {
      toast.error(error);
    }
  }, [isUpdated, error, navigate]);
  



  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('password', password);

    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(updateUserPassword(formData, token)); 
    } else {
      toast.error('Authentication token is missing');
    }
  };



  return (
    <div>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mt-2 mb-5">Update Password</h1>
            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword} // Corrected to match the state
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password} // Corrected to match the state
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
