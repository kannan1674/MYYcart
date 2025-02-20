import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { clearUpdateProfile } from '../../slices/authSlice';

const UpdateProfile = () => {
  const { loading, user, error, isUpdated } = useSelector((state) => state.authState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarView, setAvatarView] = useState('/images/images.png');

  const dispatch = useDispatch();

  // Handle changes in the form
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatar) {
        setAvatarView(`http://127.0.0.1:8000${user.avatar}`);
      }
    }

    if (isUpdated) {
      toast('User Updated Successfully',{
        type:"success",
        onOpen:()=>{dispatch(clearUpdateProfile())}
      });
      return;
    }

    if (error) {
      toast.error(error || 'An error occurred', {
       
      });
      return;
    }
  }, [dispatch, user, isUpdated, error]);

  const onChangeHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarView(reader.result);
        setAvatar(e.target.files[0]);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('avatar', avatar);
  
    const token = localStorage.getItem('authToken');
   
  
    if (token) {
      dispatch(updateUserProfile(formData, token)); 
    } else {
      toast.error('Authentication token is missinddddddg');
    }
  };
  

  return (
    <div>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
            <h1 className="mt-2 mb-5">Update Profile</h1>

            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarView}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    onChange={onChangeHandler}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
