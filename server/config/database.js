// const mongoose = require('mongoose')

// const DB = () => {
//     mongoose.connect(process.env.Local_DB, {
//         bufferCommands: false  // Set the timeout here
//     })
//     .then(con => {
//         console.log(`MongoDB Connected Successfully on Host ${con.connection.host}`);
//     })
//     .catch(err => {
//         console.error('MongoDB Connection Error:', err.message);
//     });
// };


// module.exports = DB;

const mongoose = require('mongoose');

const DB = async () => {
    try {
        const con = await mongoose.connect(process.env.Local_DB);
        console.log(`MongoDB Connected Successfully on Host ${con.connection.host}`);
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);  // Exit if connection fails
    }
};

module.exports = DB;
