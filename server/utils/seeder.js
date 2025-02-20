// const data = require('../data/product.json')
// const products = require('../model/productModel')
// const dotenv = require('dotenv')
// const DB = require('../config/database')

// dotenv.config({path:'server/config/config.env'})
// DB();

// const seedProducts= async()=>{
//     try {
//         await DB();

//         await products.deleteMany();
//         console.log('Products Deleted')
//         await products.insertMany(data);
//         console.log('Products Added')
//         process.exit();
//     } catch (error) {
//         console.log(error)
        
//     }
   
// }

// seedProducts();
const data = require('../data/product.json');
const products = require('../model/productModel');
const dotenv = require('dotenv');
const DB = require('../config/database');

dotenv.config({ path: 'server/config/config.env' });

const seedProducts = async () => {
    try {
        // Ensure DB connection is established before continuing
        await DB();

        // Perform seeding operations after the connection is established
        await products.deleteMany();
        console.log('Products Deleted');

        await products.insertMany(data);
        console.log('Products Added');
        process.exit();
    } catch (error) {
        console.error(error); // Log the actual error
    }
};

seedProducts();
