// routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  updateDisabilityType,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/disability-type", protect, updateDisabilityType);

module.exports = router;
