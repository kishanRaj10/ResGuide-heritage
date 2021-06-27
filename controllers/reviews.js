/** @format */

const Review = require("../models/review");
const Heritage = require("../models/heritage");

module.exports.createReview = async (req, res) => {
  const heritage = await Heritage.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  heritage.reviews.push(review);
  await review.save();
  await heritage.save();
  req.flash("success", "Review added successfully");
  res.redirect(`/heritages/${heritage._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Heritage.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("error", "Review deleted successfully");
  res.redirect(`/heritages/${id}`);
};
