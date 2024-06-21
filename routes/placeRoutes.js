const express = require("express");
const placeController = require("../controllers/placeController");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.get("/search", placeController.searchPlaces);
router.get("/route/:id", placeController.getRoute);
router.get("/:id", placeController.getPlaceById);
router.post("/:id/reviews", upload.single("image"), placeController.addReview);

module.exports = router;
