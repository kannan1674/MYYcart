
import { loginRequest, loginSuccess, loginFail,registerRequest,registerSuccess,registerFail, clearError, loadUserRequest, loadUserSuccess, loadUserFail, logoutSuccess, logoutFail, updateProfileRequest, updateProfileSuccess, updateProfileFail, updatePasswordRequest, updatePasswordSuccess, updatePasswordFail, forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFail, resetPasswordRequest, resetPasswordSuccess, resetPasswordFail } from '../slices/authSlice'; // Assuming you have these actions
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());

        const { data } = await axios.post(
 'http://localhost:8000/api/user-signin',
            { email, password },
            {
               withCredentials: true, // Include cookies in the request
            }
        );

        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(loginFail(error.response.data.message));
    }
};

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest())

        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            },
            withCredentials: true, // Include cookies in the request
        }

        const { data } = await axios.post('http://localhost:8000/api/user-register', userData, config);
        dispatch(registerSuccess(data))
    } catch (error) {
        dispatch(registerFail())
    }
}


export const clearAuthError = dispatch=>{
    dispatch(clearError())
}

export const loadUser = async (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
        dispatch(loadUserFail());
        return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      dispatch(loadUserRequest());
      const { data } = await axios.get('http://localhost:8000/api/user-myprofile', config);
      dispatch(loadUserSuccess({ user: data }));
    } catch (error) {
      console.error(error);
      dispatch(loadUserFail(error.response?.data?.message || 'Failed to load user'));
    }
};
  
export const  logout=async(dispatch)=>{
    try {
        axios.get('http://localhost:8000/api/user-logout')
        dispatch(logoutSuccess())
    } catch (error) {
        dispatch(logoutFail())
        
    }
}


export const updateUserProfile = (userData) => async (dispatch) => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage or wherever it's stored
    if (!token) {
      return dispatch(updateProfileFail('Authentication token is missing.'));
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        'Content-Type': 'multipart/form-data', 
      },
      withCredentials: true, 
    };
  
    try {
      dispatch(updateProfileRequest());
  
     
      const { data } = await axios.put('http://localhost:8000/api/user-updateprofile', userData, config);
  
      dispatch(updateProfileSuccess(data)); 
    } catch (error) {
      
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      dispatch(updateProfileFail(errorMessage));
    }
  };
  
  
  export const updateUserPassword = (formData) => async (dispatch) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Authentication token is missing.');
      return dispatch(updatePasswordFail('Authentication token is missing.'));
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
  
    try {
      dispatch(updatePasswordRequest());
   
  
      const { data } = await axios.put(
        'http://localhost:8000/api/password/change',
        formData,
        config
      );
  
      dispatch(updatePasswordSuccess({payload: data.success}));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      console.error('Error updating password:', errorMessage);
      dispatch(updatePasswordFail(errorMessage));
    }
  };

  export const resetUserPassword = (formData,token) => async (dispatch) => {
  
  
    const config = {
      headers: {
       // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
  
    try {
      dispatch(resetPasswordRequest());
   
  
      const { data } = await axios.post(
        `http://localhost:8000/api/password/reset/${token}`,
        formData,
        config
      );
  
      dispatch(resetPasswordSuccess(data));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      console.error('Error updating password:', errorMessage);
      dispatch(resetPasswordFail(errorMessage));
    }
  };
  export const forgotUserPassword = (formData) => async (dispatch) => {
 
  
    const config = {
      headers: {
       // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
  
    try {
      dispatch(forgotPasswordRequest());
   
  
      const { data } = await axios.post(
        'http://localhost:8000/api/user-forgotpassword',
        formData,
        config
      );
  
      dispatch(forgotPasswordSuccess(data));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      console.error( errorMessage);
      dispatch(forgotPasswordFail(errorMessage));
    }
  };
  

