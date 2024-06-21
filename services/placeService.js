const dataService = require("./dataService");

async function searchPlaces(query, lat, lon) {
  console.log(query);
  const datasets = ["accessibility_buildings", "streets"];
  let allPlaces = [];

  for (const dataset of datasets) {
    const data = await dataService.getCachedData(dataset);
    allPlaces = allPlaces.concat(Object.values(data));
  }

  const placesArray = Object.values(allPlaces[0]).concat(
    Object.values(allPlaces[1])
  );

  const filteredPlaces = placesArray.filter((place) => {
    console.log(place);
    return Object.values(place).some((value) => {
      if (typeof value === "string") {
        return value.toString().toLowerCase().includes(query.toLowerCase());
      }
      return false;
    });
  });

  return filteredPlaces;
}

module.exports = { searchPlaces };
