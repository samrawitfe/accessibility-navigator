const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

router.post("/submit", reviewController.submitReview);
router.get("/:placeId", reviewController.getReviews);

module.exports = router;
