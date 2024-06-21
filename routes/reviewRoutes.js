// routes/reviewRoutes.js
const express = require("express");
const {
  addReview,
  getReviewsByPlaceId,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/:id/reviews", protect, upload.single("image"), addReview);
router.get("/:id/reviews", getReviewsByPlaceId);

module.exports = router;
