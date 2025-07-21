const Destination = require('../model/destination.model');
const User = require("../model/user.model")

// List (with filtering/search)
const getAllDestinations = async (req, res) => {
  try {
    const filter = {};

    // Category filter (exact)
    if (req.query.category) {
      filter.categories = req.query.category;
    }

    // Name search (case-insensitive, partial match)
    if (req.query.q) {
      filter.name = { $regex: req.query.q, $options: 'i' };
    }

    // Price filter: expects minPrice and/or maxPrice as query params
    if (req.query.minPrice || req.query.maxPrice) {
      filter['estimatedCost.midRange.min'] = {};
      if (req.query.minPrice) {
        filter['estimatedCost.midRange.min'].$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter['estimatedCost.midRange.min'].$lte = Number(req.query.maxPrice);
      }
      // Clean up empty object if neither param used
      if (Object.keys(filter['estimatedCost.midRange.min']).length === 0) {
        delete filter['estimatedCost.midRange.min'];
      }
    }

    // Minimum average rating
    if (req.query.rating) {
      filter['ratings.average'] = { $gte: Number(req.query.rating) };
    }

    // Tag filter
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    // Pagination (optional but helps performance)
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 12;
    const skip = (page - 1) * pageSize;

    const destinations = await Destination.find(filter)
      .skip(skip)
      .limit(pageSize);

    const total = await Destination.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: destinations,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching destinations' });
  }
};

// Get single destination
const getDestinationById = async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, data: dest });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching destination' });
  }
};

// Create new destination
const createDestination = async (req, res) => {
  try {
    // Optionally: check req.user for admin role
    const dest = await Destination.create(req.body);
    res.status(201).json({ success: true, data: dest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Error creating destination' });
  }
};

// Update destination
const updateDestination = async (req, res) => {
  try {
    // Optionally: check req.user for admin role
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Error updating destination' });
  }
};

// Delete destination
const  deleteDestination = async (req, res) => {
  try {
    // Optionally: check req.user for admin role
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, message: 'Destination deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Error deleting destination' });
  }
};

//Destination Likes
const likeDestination = async(req,res) => {
  try {
    const user = await User.findById(req.user.userId);
    const destId = req.params.id;
    
    if(!user){
      return res.status(404).json({success:false, message:"User Not Found!!!"})
    }

    if(!user.savedDestinations.includes(destId)){
      user.savedDestinations.push(destId);
      await user.save();
    }

    return res.status(200).json({success:true, message:"Destination saved to Favorites"})
  } catch (error) {
    return res.status(500).json({success:false, message:error.message})
  }
}


//Unlike Destination

const unlikeDestination = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const destId = req.params.id;
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.savedDestinations = user.savedDestinations.filter(
      id =>id && id.toString() !== destId
    );
    await user.save();

    res.json({ success: true, message: "Destination removed from favorites" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Add a review to a destination
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const destination = await Destination.findById(req.params.id);

    if (!destination) return res.status(404).json({ success: false, message: "Destination not found" });

    // Prevent duplicate review per user
    const alreadyReviewed = destination.reviews.find(
      r => r.user.toString() === req.user.userId
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "You have already reviewed this destination" });
    }

    // Add the review
    const review = {
      user: req.user.userId,
      rating: Number(rating),
      comment: comment || "",
      date: Date.now(),
    };
    destination.reviews.push(review);

    // Update average rating and count
    destination.ratings.count = destination.reviews.length;
    destination.ratings.average = (
      destination.reviews.reduce((sum, r) => sum + r.rating, 0) / destination.reviews.length
    ).toFixed(2);

    await destination.save();
    res.json({ success: true, message: "Review added" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all reviews for a destination
const getReviews = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('reviews.user', 'profile.firstName profile.lastName');
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }
    res.json({ success: true, data: destination.reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};








module.exports = {getAllDestinations, getDestinationById, createDestination, updateDestination, deleteDestination, likeDestination, unlikeDestination, addReview, getReviews}