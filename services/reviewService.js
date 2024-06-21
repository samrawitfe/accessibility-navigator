const cloudant = require("../utils/cloudant");

async function getReviewsByPlaceId(placeId) {
  const reviews = await cloudant.getData("reviews");
  return reviews.filter((review) => review.placeId === placeId);
}

async function addReview(review) {
  await cloudant.storeData("reviews", review);
}

module.exports = { getReviewsByPlaceId, addReview };
