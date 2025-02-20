import axios from 'axios';
import { adminProductsFail, adminProductsRequest, adminProductsSuccess, productsFail, productsRequest, productsSuccess } from '../slices/productsSlices';

export const getProducts = (keyword,price,category,rating,currentPage)=> {
    return async (dispatch) => {  
        try {
            dispatch(productsRequest());  
            let link = `http://localhost:8000/api/get-products?page=${currentPage}`

            if(keyword){
                link += `&keyword=${keyword}`
            }
            if(price){
                link += `&price[gte]=${price[0]}&&price[lte]=${price[1]}`
            }
            if(category){
                link += `&category=${category}`
            }
            if(rating){
                link += `&ratings=${rating}`
            }
            const { data } = await axios.get(link);  // Fetch products
            dispatch(productsSuccess(data)); 
        } catch (error) {
            dispatch(productsFail(error.response ? error.response.data.message : 'Something went wrong'));  // Handle errors
        }
    };
};

export const getAdminProducts = async(dispatch)=>{
 const token = localStorage.getItem('authToken');
  if (!token) {
    return dispatch(adminProductsFail('Authentication token is missing.'));
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
    try {
        dispatch(adminProductsRequest())
        const {data} = await axios.get(`http://localhost:8000/api/Admin/all-products`)
        dispatch(adminProductsSuccess(data))
    } catch (error) {
        dispatch(adminProductsFail(error.response?error.response.data.message:'something wrong'))
    }

}