const express = require('express');
const authMiddlewares = require("../middlewares/authMiddlewares")
const {getAllDestinations, getDestinationById, createDestination, updateDestination, deleteDestination,likeDestination, unlikeDestination, addReview, getReviews } = require('../controllers/destination.controller');

const destinationRoutes = express.Router();

// Get all destinations (supports filtering via query)
destinationRoutes.get('/', getAllDestinations);

// Get a specific destination by ID
destinationRoutes.get('/:id', getDestinationById);

// Create a new destination (protected: admin only)
destinationRoutes.post('/', createDestination);

// Update a destination (protected: admin only)
destinationRoutes.put('/:id', updateDestination);

// Delete a destination (protected: admin only)
destinationRoutes.delete('/:id', deleteDestination);

//like Destination
destinationRoutes.put('/:id/like',authMiddlewares, likeDestination);

//Unlike Destination
destinationRoutes.put('/:id/unlike',authMiddlewares, unlikeDestination);

// Add a review/rating to a destination
destinationRoutes.put('/:id/review', authMiddlewares,addReview);

// Get all reviews for a destination
destinationRoutes.get('/:id/reviews', getReviews);

module.exports = destinationRoutes;
