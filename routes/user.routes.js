const express = require('express');
const authMiddlewares = require("../middlewares/authMiddlewares")
const {getProfile, updateProfile, getFavoriteDestinations,getMyReviews} = require("../controllers/user.controller") 


const userRoutes = express.Router();

//profile
userRoutes.get("/profile",authMiddlewares, getProfile);
userRoutes.put("/profile", authMiddlewares, updateProfile);

// Get all favorite (saved) destinations for the current user
userRoutes.get('/favorites', authMiddlewares, getFavoriteDestinations);

//get  reivews
userRoutes.get('/reviews', authMiddlewares, getMyReviews);






module.exports = userRoutes;