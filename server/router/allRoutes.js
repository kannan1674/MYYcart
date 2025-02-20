const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const authController = require('../controller/authController')
const orderController = require('../controller/orderController')
const PaymentController = require('../controller/paymentController')
const {isAuthenticated,authorizeRoles} = require('../middleware/isAuthenticated')
const multer = require('multer')
const path = require('path')

//Image Upload
const upload = multer({storage:multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'..','uploads/user'))
    },
    filename:function(req,file,cb){ 
        cb(null,file.originalname)
    }
})})



//Product
router.get('/get-products',productController.getProduct)
router.post('/Admin/create-products',isAuthenticated,authorizeRoles('admin'),productController.createProduct)
router.get('/Admin/all-products',productController.getAllProducts)
router.route('/product/:id').get(productController.getSingleProduct)
                            .put(productController.updateProduct)
                            .delete(productController.DeleteProduct)

//Auth

router.post('/user-register',upload.single('avatar'),authController.registerUser)
router.post('/user-signin',authController.signin)
router.post('/user-logout',authController.logoutUser)
router.post('/user-forgotpassword',authController.forgotPassword)
router.post('/password/reset/:token',authController.resetPassword)
router.put('/password/change',isAuthenticated,authController.changePassword)
router.get('/user-myprofile',isAuthenticated,authController.getUserProfile)
router.put('/user-updateprofile',isAuthenticated,upload.single('avatar'),authController.updateProfile)

//ADMIN ROUTES
router.get('/Admin/getallusers',isAuthenticated,authorizeRoles('admin'),authController.admingetallusers)
router.get('/Admin/users/:id',isAuthenticated,authorizeRoles('admin'),authController.admingetuser)
router.put('/Admin/users/:id',isAuthenticated,authorizeRoles('admin'),authController.adminupdateUser)
router.delete('/Admin/users/:id',isAuthenticated,authorizeRoles('admin'),authController.admindeleteUser)

//Order Routes
router.post('/order/new',isAuthenticated,orderController.createOrder)
router.get('/order/getorder/:id',isAuthenticated,orderController.singleOrder)
router.get('/order/myorder',isAuthenticated,orderController.getMyOrder)
router.get('/admin/order/allorder',isAuthenticated,authorizeRoles('admin'),orderController.getAllOrders)
router.put('/admin/order/updateorder/:id',isAuthenticated,authorizeRoles('admin'),orderController.updateOrders)
router.delete('/admin/order/deleteorder/:id',isAuthenticated,authorizeRoles('admin'),orderController.deleteOrder)
//Review
router.put('/review/create',isAuthenticated,productController.createReview)
router.get('/review/get',isAuthenticated,productController.getReview)
router.delete('/review/delete',isAuthenticated,productController.deleteReview)

//Stripe Payment
router.post('/stripe/process',PaymentController.processPayment)
 router.get('/stripe/apiKey',PaymentController.sendStripeApi)
module.exports = router;
