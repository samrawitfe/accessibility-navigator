const locationRouter = require("express").Router();
// const Location = require("../models/location");
const logger = require("../utils/logger");

// controllers/locations.js
const { client, placeDbName, reviewDbName } = require('../utils/cloudant');


locationRouter.post("/", async (req, res) => {
  try {
    const place = req.body;
    const response = await client.postDocument({
      db: placeDbName,
      document: place,
    });
    res.status(201).json(response.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

locationRouter.get("/", async (req, res) => {
  try {
    const response = await client.postAllDocs({
      db: placeDbName,
      includeDocs: true,
    });
    res.status(200).json(response.result.rows.map(row => row.doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a location
locationRouter.get("/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const response = await client.getDocument({
      db: placeDbName,
      docId: placeId,
    });
    res.status(200).json(response.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a location
locationRouter.put("/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const place = req.body;
    const existingPlace = await client.getDocument({
      db: placeDbName,
      docId: placeId,
    });
    place._id = placeId;
    place._rev = existingPlace.result._rev; // Include the latest _rev value
    const response = await client.putDocument({
      db: placeDbName,
      docId: placeId,
      document: place,
    });
    res.status(200).json(response.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a location
locationRouter.delete("/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const place = await client.getDocument({
      db: placeDbName,
      docId: placeId,
    });
    const response = await client.deleteDocument({
      db: placeDbName,
      docId: placeId,
      rev: place.result._rev,
    });
    res.status(200).json(response.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = locationRouter;

