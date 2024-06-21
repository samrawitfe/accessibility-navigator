const express = require("express");
const app = express();
const cors = require("cors");
const unknownEndpoint = require("./middleware/unknownEndpoint");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const dataService = require("./services/dataService");
const placeRoutes = require("./routes/placeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/places", reviewRoutes);
app.use("/api/test", require("./routes/testController"));

setInterval(dataService.updateCachedData, 3600000);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
