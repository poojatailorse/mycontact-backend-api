const express = require("express");
const dotenv = require("dotenv");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
connectDb();
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;
app.use('/api/contacts',contactRoutes);
app.use('/api/users',userRoutes);

app.use(errorHandler);
app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})