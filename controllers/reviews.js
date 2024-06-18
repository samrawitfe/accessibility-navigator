const cloudant = require('../utils/cloudant');
const axios = require('axios');
const buildingRouter = require('express').Router();

buildingRouter.get('/', async (req, res) => {
    const data = await fetchData();
    const combinedData = processAndCombineData(data);
    res.json(combinedData);
  });


// Define the endpoints to fetch data from

const endpoints = {
  publicTransportRoutes: 'https://gis.brno.cz/ags1/rest/services/ODAE/ODAE_ids_jmk_sit/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
  buildingsResearch: 'https://gis.brno.cz/ags1/rest/services/Hosted/KAM_pruzkum_budov_OD_WGS_Projekt/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
  streets: 'https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/ulicni_sit/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
};

// Function to fetch data from all endpoints
const fetchData = async () => {
  try {
    // Fetch data from all endpoints concurrently
    const responses = await Promise.all(Object.values(endpoints).map(url => axios.get(url)));
    return {
      publicTransportRoutes: responses[0].data,
      buildingsResearch: responses[1].data,
      streets: responses[2].data,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const processAndCombineData = (data, userLocation = [16.614099, 49.187343]) => {
  const buildings = data.buildingsResearch.features;

  // Calculate distance from user location to each building
  const buildingsWithDistance = buildings.map(building => {
    const distance = calculateDistance(userLocation, building.geometry.coordinates);
    return { ...building, distance };
  });

  // Sort buildings by distance
  const sortedBuildings = buildingsWithDistance.sort((a, b) => a.distance - b.distance);

  // Get the nearest 10 buildings
  const nearestBuildings = sortedBuildings.slice(0, 10);

  // For simplicity, we'll just return the nearest buildings without calculating the best route
  // In a real application, you would use a routing API to get the best route
  return nearestBuildings.map(building => ({
    building: building.properties,
    distance: building.distance,
  }));
};

const calculateDistance = (coord1, coord2) => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2 - lat1) * Math.PI/180;
  const Δλ = (lon2 - lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c; // in metres
  return distance;
};


  module.exports = buildingRouter;
  