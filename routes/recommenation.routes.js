const express = require('express');
const authMiddlewares = require("../middlewares/authMiddlewares");
const {getRecommendations} = require("../controllers/recommendations.controller")


const recommendationRoutes = express.Router();

//recommedation for desitnation
recommendationRoutes.get("/",authMiddlewares, getRecommendations)





module.exports = recommendationRoutes;