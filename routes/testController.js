const express = require("express");
const router = express.Router();
const dataService = require("../services/dataService");

const updateDb = (req, res) => {
  dataService.updateCachedData();
  res.send("Updated");
};
router.get("/update-db", updateDb);

module.exports = router;
