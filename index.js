const express = require('express');
const cors = require('cors')
require('dotenv').config();
const connectMongoDB = require("./config/mongoDB.config");
const authRouter = require("./routes/auth.routes");
const destinationRoutes = require("./routes/destinationRoutes")
const userRoutes = require("./routes/user.routes")
const recommendationRoutes = require("./routes/recommenation.routes")


const app = express();
const port = process.env.PORT || 8000;

//connect MongoDB
connectMongoDB();


//middlewares
app.use(cors())
app.use(express.json());


//routes
app.use("/api/auth",authRouter);
app.use('/api/destinations',destinationRoutes);
app.use("/api/users",userRoutes);
app.use("/api/recommendations",recommendationRoutes)





//unhandle routes
app.use((req,res) => {
    return res.status(404).json({message:"404 Not Found!!!"})
})


//server
app.listen(port, () => {
    console.log(`Server is running at  http://localhost:${port}`)
})