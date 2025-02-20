 const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type:String,
       
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"],
        required: [true, "Please enter product Name"]
    },
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    description: {
        type: String,
       required: [true, "Please enter product description"]
    },
    ratings: {
        type: Number, // Changed to Number for ratings
        default: 0
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        //required: [true, "Please enter product category"],
        enum: {
            values: [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: "Please select correct category"
        }
    },
    seller: {
        type: String,
       // required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        //required: [true, "Please enter product stock"],
        max: [20, 'Product stock cannot exceed 20'] // Changed maxLength to max for number
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: String, 
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdUser:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now // Changed to Date.now (without parentheses)
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
