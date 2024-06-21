const express = require("express");
const placeController = require("../controllers/placeController");
const router = express.Router();

router.get("/search", placeController.searchPlaces);
router.get("/route/:id", placeController.getRoute);

module.exports = router;
