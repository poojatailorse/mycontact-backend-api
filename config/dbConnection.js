const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = async () => {
    try{
        console.log("process.env.CONNECTION_STRING",process.env.CONNECTION_STRING)
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("database connected", connect.connection.host, connect.connection.name);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};
module.exports = connectDb;