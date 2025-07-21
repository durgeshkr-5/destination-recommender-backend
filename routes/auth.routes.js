const express = require('express');
const {signup, login, resetPassword, forgotPassword, getProfile} = require("../controllers/auth.controller")
const authMiddlewares = require("../middlewares/authMiddlewares")






const authRouter = express();


authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.post("/forgot-password",forgotPassword);
authRouter.put("/reset-password/:token",resetPassword);

// authRouter.get("/profile",authMiddlewares, getProfile)




module.exports = authRouter