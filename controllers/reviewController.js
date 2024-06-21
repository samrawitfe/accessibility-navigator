const cloudant = require("../utils/cloudant");

async function submitReview(req, res) {
  const review = req.body;
  await cloudant.storeData("reviews", review);
  res.status(201).json({ message: "Review submitted successfully" });
}

async function getReviews(req, res) {
  const placeId = req.params.placeId;
  const reviews = await cloudant.getData("reviews");
  const filteredReviews = reviews.filter(
    (review) => review.placeId === placeId
  );
  res.json(filteredReviews);
}

module.exports = { submitReview, getReviews };
