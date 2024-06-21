const placeService = require("../services/placeService");
const dataService = require("../services/dataService");
const navigationService = require("../services/navigationService");
const reviewService = require("../services/reviewService");
const { uploadImage } = require("../utils/ibmCos");

async function searchPlaces(req, res) {
  const query = req.query.q;
  const lat = req.query.lat ? parseFloat(req.query.lat) : null;
  const lon = req.query.lon ? parseFloat(req.query.lon) : null;

  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter "q" is required' });
  }

  try {
    const places = await placeService.searchPlaces(query, lat, lon);
    res.json({ success: true, data: places });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function getPlaceById(req, res) {
  const placeId = req.params.id;

  try {
    const place = await placeService.getPlaceById(placeId);
    if (!place) {
      return res
        .status(404)
        .json({ success: false, message: "Place not found" });
    }

    const reviews = await reviewService.getReviewsByPlaceId(placeId);
    res.json({ success: true, data: { place, reviews } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function addReview(req, res) {
  const placeId = req.params.id;
  const { text, rating } = req.body;
  const image = req.file; // Assuming you're using multer for file uploads

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
      placeId,
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
}

async function getRoute(req, res) {
  const placeId = req.params.id;
  const place = await dataService
    .getCachedData("buildings_research")
    .find((p) => p.id === placeId);
  const route = await navigationService.getRoute(place);
  res.json(route);
}

module.exports = { searchPlaces, getPlaceById, addReview, getRoute };
