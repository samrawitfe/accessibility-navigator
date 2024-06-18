// models/review.model.js
const reviewSchema = {
    review_id: String,
    user_id: String,
    review_text: String,
    review_date: Date,
    rating: Number,
  };
  
  module.exports = reviewSchema;
  