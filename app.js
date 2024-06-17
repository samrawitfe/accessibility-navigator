const express = require("express");
const app = express();
const cors = require("cors");
const locationRouter = require("./controllers/locations");
app.use(cors());
app.use(express.json());
app.use("/api/locations", locationRouter);

module.exports = app;
