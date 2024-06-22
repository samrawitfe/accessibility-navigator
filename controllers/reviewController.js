// controllers/reviewController.js
const reviewService = require("../services/reviewService");
const { uploadImage } = require("../utils/ibmCos");

exports.addReview = async (req, res) => {
  const { text, userId, username } = req.body;
  const image = req.file; // Assuming you're using multer for file uploads

  if (!text) {
    return res
      .status(400)
      .json({ success: false, message: "Text is required" });
  }

  try {
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
    }

    const review = {
      placeId: req.params.id,
      user: { id: userId, username },
      text,
      imageUrl: imageUrl ? [imageUrl] : [],
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
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
