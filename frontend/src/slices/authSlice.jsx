import { createSlice } from '@reduxjs/toolkit';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    isAuthenticated: safeParse(localStorage.getItem('isAuthenticated'), false),
    user: safeParse(localStorage.getItem('user'), null),
    authToken:safeParse(localStorage.getItem('authToken'),false),
    error: null,
    isUpdated: false,
  },
  reducers: {
    loginRequest(state) {
      return { ...state, loading: true };
    },
    loginSuccess(state, action) {
      const { user, token } = action.payload;  // Ensure the token is part of the payload
      
      localStorage.setItem('authToken', token);  // Store the token
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user,
      };
    },
    loginFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    clearError(state) {
      return { ...state, error: null };
    },
    registerRequest(state) {
      return { ...state, loading: true };
    },
    registerSuccess(state, action) {
      const { user, token } = action.payload;  // Ensure the token is part of the payload
      
      localStorage.setItem('authToken', token);  // Store the token
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user,
      };
    },
    registerFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    loadUserRequest(state) {
      return { ...state, loading: true };
    },
    loadUserSuccess(state, action) {
      const { user, token } = action.payload;  
      
      localStorage.setItem('authToken', token);  
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user,
      };
    },
    loadUserFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    logoutSuccess(state) {
      localStorage.removeItem('authToken');  // Remove the authToken on logout
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isUpdated: false,
      };
    },
    logoutFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    updateProfileRequest(state) {
      return { ...state, loading: true, isUpdated: false };
    },
    updateProfileSuccess(state, action) {
      const updatedUser = action.payload.user; 
      localStorage.setItem('user', JSON.stringify(updatedUser));  
      localStorage.setItem('authToken', action.payload.token);  
      
      return {
        ...state,
        loading: false,
        user: updatedUser, 
        isUpdated: true,
      };
    },    
    updateProfileFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    clearUpdateProfile(state, action) {
      return { ...state, isUpdated:false};
    },

    updatePasswordRequest(state) {
      return { ...state, loading: true, isUpdated: false };
    },
    updatePasswordSuccess(state, action) {
      
      return {
      
        loading: false,
      message:action.payload.message
        
      };
    },    
    updatePasswordFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    forgotPasswordRequest(state) {
      return { ...state, loading: true,message:null };
    },
    forgotPasswordSuccess(state, action) {
      
      return {
        loading: false,
      message:action.payload.message
        
      };
    },    
    forgotPasswordFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    resetPasswordRequest(state) {
      return { ...state, loading: true };
    },
    resetPasswordSuccess(state, action) {
      
      return {
        loading: false,
        isAuthenticated:true,
      user:action.payload.user
        
      };
    },    
    resetPasswordFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
  },
});

const { actions, reducer } = authSlice;

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updatePasswordFail,
  clearUpdateProfile,
  updatePasswordRequest,
  updatePasswordSuccess,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail
} = actions;

export default reducer;
