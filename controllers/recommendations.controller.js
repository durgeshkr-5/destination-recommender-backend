const User = require("../model/user.model");
const Destination = require("../model/destination.model.js");



function scoreDestination(userPrefs, destination) {
  let score = 0;
  // Interests/category matching
  if (userPrefs.interests?.length && destination.categories?.length) {
    const match = userPrefs.interests.filter(tag =>
      destination.categories.includes(tag)
    );
    score += match.length * 2;
  }
  // Activities matching
  if (userPrefs.activities?.length && destination.activities?.length) {
    const match = userPrefs.activities.filter(tag =>
      destination.activities.includes(tag)
    );
    score += match.length * 1.5;
  }
  // Budget match (midRange used as demo)
  if (
    userPrefs.budgetRange &&
    destination.estimatedCost &&
    destination.estimatedCost.midRange &&
    destination.estimatedCost.midRange.min >= userPrefs.budgetRange.min &&
    destination.estimatedCost.midRange.max <= userPrefs.budgetRange.max
  ) {
    score += 2;
  }
  // Travel style matching (if desired: e.g., family, solo, group)
  if (
    userPrefs.travelStyle &&
    destination.categories &&
    destination.categories.includes(userPrefs.travelStyle)
  ) {
    score += 1;
  }
  // Simple rating boost
  if (destination.ratings?.average) {
    score += destination.ratings.average;
  }
  return score;
}

const getRecommendations = async (req, res) => {
  try {
    // Look up user and preferences
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userPrefs = user.profile?.preferences || {};

    // Fetch all destinations (filter active only)
    const destinations = await Destination.find({ isActive: true });

    // Score and sort
    const scored = destinations
      .map(dest => ({
        dest,
        score: scoreDestination(userPrefs, dest),
      }))
      .sort((a, b) => b.score - a.score);

    // Take top N recommendations
    const topN = scored.slice(0, 10).map(d => d.dest);

    res.json({ success: true, recommendations: topN });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {getRecommendations}