const locationRouter = require("express").Router();
// const Location = require("../models/location");
const logger = require("../utils/logger");

locationRouter.get("/", async (req, res) => {
  try {
    // const locations = await Location.findAll();
    const locations = [
      {
        id: 1,
        name: "Location 1",
        address: "Address 1",
        city: "City 1",
        state: "State 1",
        country: "Country 1",
        latitude: 1,
        longitude: 1,
      },
      {
        id: 2,
        name: "Location 2",
        address: "Address 2",
        city: "City 2",
        state: "State 2",
        country: "Country 2",
        latitude: 2,
        longitude: 2,
      },
    ];
    res.status(200).json(locations);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

locationRouter.get("/:id", async (req, res) => {
  try {
    // const location = await Location.findById(req.params.id);
    const location = {
      id: 1,
      name: "Location 1",
      address: "Address 1",
      city: "City 1",
      state: "State 1",
      country: "Country 1",
      latitude: 1,
      longitude: 1,
    };
    res.status(200).json(location);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = locationRouter;
