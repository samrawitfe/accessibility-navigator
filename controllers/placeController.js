const placeService = require("../services/placeService");
const dataService = require("../services/dataService");
const navigationService = require("../services/navigationService");

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

async function getRoute(req, res) {
  const placeId = req.params.id;
  const place = await dataService
    .getCachedData("buildings_research")
    .find((p) => p.id === placeId);
  const route = await navigationService.getRoute(place);
  res.json(route);
}

module.exports = { searchPlaces, getRoute };
