import { addCartItemRequest, addCartItemSuccess } from "../slices/cartSlice";
import axios from 'axios';

export const addToCart = (id, quantity) => async (dispatch) => {
    try {
        // Dispatch the request action
        dispatch(addCartItemRequest());
        
        // Await the API call to fetch product data
        const { data } = await axios.get(`http://localhost:8000/api/product/${id}`);
        
        // Dispatch the success action with the product data
        dispatch(addCartItemSuccess({
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].image,
            stock: data.product.stock,
            quantity
        }));
    } catch (error) {
        console.error("Failed to fetch product data:", error);
        // Optionally dispatch an error action if you have one
    }
};
