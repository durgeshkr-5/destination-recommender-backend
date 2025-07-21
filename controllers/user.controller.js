const User = require('../model/user.model');
const Destination = require("../model/destination.model");
const Review = require("../model/review.model")

// Get current authenticated user's profile & preferences
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update current user's profile & preferences
const updateProfile = async (req, res) => {
  try {
    
    
    const {firstName, lastName, interests, budgetRange, travelStyle, activities} = req.body;
    
    //find user
    const user = await User.findById(req.user.userId);
    if(!user){
        return res.status(404).json({success:false, message:"User Not found!!!"})
    }

    if(firstName){
        user.profile.firstName = firstName
    }
    if(lastName){
        user.profile.lastName = lastName
    }
    if(interests){
        user.profile.preferences.interests  = interests
    }
    if(budgetRange){
       user.profile.preferences.budgetRange  = budgetRange
    }
    if(travelStyle){
        user.profile.preferences.travelStyle  = travelStyle
    }
    if(activities){
        user.profile.preferences.activities  = activities;
    }
        await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//Get All Favorite (Liked) Destinations
const getFavoriteDestinations = async (req, res) => {
  try {
   
    // Find user by ID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Populate destination objects by their IDs
    const favoriteDestinations = await Destination.find({
      _id: { $in: user.savedDestinations }
    });
    res.json({ success: true, data: favoriteDestinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//review
const getMyReviews = async (req, res) => {
  try {
    // Find all reviews where 'user' matches the logged-in user's ID
    const reviews = await Review.find({ user: req.user.userId })
      .populate('destination', 'name _id'); // populate name/_id for each destination

    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {getProfile, updateProfile, getFavoriteDestinations, getMyReviews}