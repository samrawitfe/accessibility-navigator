// controllers/reviewController.js
const reviewService = require("../services/reviewService");
const { uploadImage } = require("../utils/ibmCos");

exports.addReview = async (req, res) => {
  const { text, rating } = req.body;
  const image = req.file;

  if (!text || !rating) {
    return res
      .status(400)
      .json({ success: false, message: "Text and rating are required" });
  }

  try {
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
    }

    const review = {
      placeId: req.params.id,
      userId: req.user._id,
      text,
      rating,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    await reviewService.addReview(review);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviewsByPlaceId = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByPlaceId(req.params.id);
    const users = await cloudant.getData("users");
    const reviewsWithUserDetails = reviews.map((review) => {
      const user = users.find((user) => user._id === review.userId);
      return {
        ...review,
        user: {
          username: user.username,
          email: user.email,
          disabilityType: user.disabilityType,
        },
      };
    });
    res.json({ success: true, data: reviewsWithUserDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
