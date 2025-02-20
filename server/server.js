const app = require('./app')

const path = require('path')
const DB = require('./config/database')


DB();

app.listen(process.env.PORT,()=>{
    console.log(`Server Successfully Run on Port ${process.env.PORT} on ${process.env.NODE_ENV}`);
    
})