const cloudant = require("../utils/cloudant");

async function getReviewsByPlaceId(placeId) {
  const reviews = await cloudant.getData("reviews");
  return reviews.filter((review) => review.placeId === placeId);
}

async function addReview(review) {
  review._id = `review_${new Date().getTime()}`;
  await cloudant.storeData("reviews", review);
}

module.exports = { getReviewsByPlaceId, addReview };
