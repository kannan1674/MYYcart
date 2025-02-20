const Product = require('../model/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsync = require('../middleware/catchAsync')
const APIFeauters = require('../utils/apiFeauters')

//Get All Products
exports.getProduct = async (req, res, next) => {
  try {
    const resPerPage = 4;

    let buildQuery = () => {
      return new APIFeauters(Product.find(), req.query).search().filter()
    }

    const filterdProductsCount = await buildQuery().query.countDocuments({})
    const totalCount = await Product.countDocuments({});

    let productsCount = totalCount

    if (filterdProductsCount !== totalCount) {
      productsCount = filterdProductsCount
    }

    const products = await buildQuery().paginate(resPerPage).query;



    return res.status(200).json({
      status: "Success",
      count: productsCount,
      resPerPage,
      products
    });
  } catch (error) {
    next(error);
  }
};


//Create Products
exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    status: 'Success',
    message: "Product Created Successfully",
    product
  });
});

//Get Single Product
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user','name email');
    if (!product) {
      return next(new ErrorHandler('Product Not Found', 404));
    }

    return res.status(200).json({
      success: true,
      status: "Success",
      product,
    });
  } catch (error) {
    // Pass any other errors to the error handling middleware
    next(error);
  }
};

//Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found"
      })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    return res.status(200).json({
      status: "Success",
      product
    })
  } catch (error) {
    next(error)

  }
}

//Delete Product
exports.DeleteProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found"
      })
    }

    product = await Product.findByIdAndDelete(req.params.id)
    return res.status(200).json({
      status: "Success",
      Message: "Product Deleted Successfully"
    })
  } catch (error) {
    next(error)

  }
}

//Create Reviews
exports.createReview = catchAsync(async(req,res,next)=>{
  try {
      const {productId,rating,comment} = req.body

      const review = {
          user:req.user.id,
          rating,
          comment
      }
      const product = await Product.findById(productId)
      const Reviewed = product.reviews.find(review=>{
         return review.user.toString() == req.user.id.toString();
      })
        
      if(Reviewed){
          product.reviews.forEach(review=>{
              if(review.user.toString()==req.user.id.toString());
              review.comment = comment;
              review.rating = rating;

          })

      }else{
          product.reviews.push(review)
          product.numOfReviews = product.reviews.length;

      }
      product.ratings = product.reviews.reduce((acc,review)=>{
         return product.ratings + acc;
      },0)/product.reviews.length;
      product.ratings = isNaN(product.ratings)?0:product.ratings;
      await product.save({validateBeforeSave:false});
      res.status(200).json({
          status:"Success",
         review
      })
  } catch (error) {
      next(error)
  }
})

//Get Reviews by ProductID
exports.getReview = catchAsync(async (req, res, next) => {
  try {
      const product = await Product.findById(req.query.id).populate('reviews.user','name,email');

      if (!product) {
          return res.status(404).json({
              success: false,
              message: "Product not found",
          });
      }

      res.status(200).json({
          status: "Success",
          reviews: product.reviews,
      });
  } catch (error) {
      next(error);
  }
});

//Delete Review
exports.deleteReview = catchAsync(async (req, res, next) => {
  try {
      // Fetch the product by its ID
      const product = await Product.findById(req.query.productId);

      // Check if the product exists
      if (!product) {
          return next(new ErrorHandler(`Product Not Found with ID: ${req.query.productId}`, 404));
      }

      // Filter out the review to be deleted
      const reviews = product.reviews.filter(review => {
        return  review._id.toString() !== req.query.id.toString()
      }
      );

      // Update the product's reviews and recalculate the average rating
      const numOfReviews = reviews.length;

      let ratings =
          reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

      // Handle NaN if no reviews are left
      ratings = isNaN(ratings) ? 0 : ratings;

      // Update the product's review details
      product.reviews = reviews;
      product.numOfReviews = numOfReviews;
      product.ratings = ratings;

      // Save the updated product
      await product.save();

      // Send the success response
      res.status(200).json({
          success: true,
          message: "Review deleted successfully",
          reviews: product.reviews,
          numOfReviews,
          ratings,
      });
  } catch (error) {
      next(error);
  }
});

exports.getAllProducts = catchAsync(async(req,res,next)=>{
  const products = await Product.find()

  res.send({
    products
  })
})