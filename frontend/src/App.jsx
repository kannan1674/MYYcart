import './App.css';
import Home from './component/Home';
import Footer from './component/layout/Footer';
import Header from './component/layout/Header';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import ProductDetails from './component/ProductDetails';
import SearchProducts from './component/SearchProducts';
import Login from './component/user/login';
import Register from './component/user/Register';
import store from './Store';
import { useEffect, useState } from 'react';
import { loadUser } from './actions/userActions';
import Profile from './component/user/Profile';
import ProductedRoutes from './ProductedRoutes';
import UpdateProfile from './component/user/UpdateProfile';
import PasswordChange from './component/user/PasswordChange';
import ForgotPassword from './component/user/ForgotPassword';
import ResetPassword from './component/user/ResetPassword';
import Cart from './component/cart/Cart';
import Shipping from './component/cart/Shopping';
import ConfirmOrder from './component/cart/ConfirmOrder';
import Payment from './component/cart/Payment';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/cart/OrderSuccess';
import UserOrder from './component/order/UserOrder';
import OrderDetils from './component/order/OrderDetils';
import OrderDetails from './component/order/OrderDetils';
import Dashboard from './component/admin/Dashboard';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser);
    async function getStripeApiKey() {
      const { data } = await axios.get('http://localhost:8000/api/stripe/apiKey');
      setStripeApiKey(data.stripeApikey);
    }
    getStripeApiKey();
  }, []);
  if (!stripeApiKey) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <>
        <HelmetProvider>
          <Header />
          <div className='container container-fluid'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/search/:keyword' element={<SearchProducts />} />
              <Route path='/product/:id' element={<ProductDetails />} />
              <Route path='/myprofile' element={<ProductedRoutes><Profile /></ProductedRoutes>} />
              <Route path='/myprofile/update' element={<ProductedRoutes><UpdateProfile /></ProductedRoutes>} />
              <Route path='/password/changePassword' element={<ProductedRoutes><PasswordChange /></ProductedRoutes>} />
              <Route path='/password/forgotPassword' element={<ForgotPassword />} />
              <Route path='/password/reset/:token' element={<ResetPassword />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/shipping' element={<ProductedRoutes><Shipping /></ProductedRoutes>} />
              <Route path='/order/confirm' element={<ProductedRoutes><ConfirmOrder /></ProductedRoutes>} />
              {stripeApiKey &&
                <Route path='/payment' element={<ProductedRoutes><Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements></ProductedRoutes>} />
              }
              <Route path='/order/success' element={<ProductedRoutes><OrderSuccess /></ProductedRoutes>} />
              <Route path='/order/myorders' element={<ProductedRoutes><UserOrder /></ProductedRoutes>} />
              <Route path='/order/:id' element={<ProductedRoutes><OrderDetails /></ProductedRoutes>} />

            </Routes>
          </div>
          <Routes>
            <Route path='/admin/dashboard' element={<ProductedRoutes isAdmin={true}><Dashboard /></ProductedRoutes>} />
          </Routes>
          <ToastContainer />
          <Footer />
        </HelmetProvider>
      </>
    </Router>
  );
}

export default App;
