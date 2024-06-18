const express = require("express");
const app = express();
const cors = require("cors");
const locationRouter = require("./controllers/places");
const buildingRouter = require("./controllers/reviews");

app.use(cors());
app.use(express.json());
app.use("/api/places", locationRouter);
app.use("/api/buildings", buildingRouter);

module.exports = app;
