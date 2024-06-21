const axios = require("axios");
const cloudant = require("../utils/cloudant");

async function getCachedData(datasetName) {
  return await cloudant.getData(datasetName);
}

async function clearData(datasetName) {
  return await cloudant.clearData(datasetName);
}

async function updateCachedData() {
  for (const dataset of datasets) {
    const data = await dataset.retrieveAndFilterFunc(dataset.url);
    console.log(data);
    await clearData(dataset.name);
    await cloudant.storeData(dataset.name, data);
  }
}
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error}`);
    throw error;
  }
}

const retrieveAndFilterAccessibilityBuildingsData = async (url) => {
  const data = await fetchData(url);
  return data.features.map((feature) => ({
    id: feature.id,
    name: feature.properties.nazev_cz,
    name_en: feature.properties.nazev_en,
    type: feature.properties.typ_budovy,
    accessibility: feature.properties.pristupnost_budovy,
    address: feature.properties.adresa,
    coordinates: feature.geometry.coordinates,
    description: feature.properties.popis_en || feature.properties.popis_cz,
    website: feature.properties.web_url,
    phone: feature.properties.telefon_cz || feature.properties.telefon_en,
  }));
};

const retrieveAndFilterAccessibilityEntrancesData = async (url) => {
  const data = await fetchData(url);
  return data.features.map((feature) => ({
    id: feature.id,
    entranceType: feature.properties.typ_vstupu,
    angle: feature.properties.uhel_smeru,
    coordinates: feature.geometry.coordinates,
  }));
};

const retrieveAndFilterPublicTransportData = async (url) => {
  const data = await fetchData(url);
  return data.features.map((feature) => ({
    id: feature.id,
    routeCoordinates: feature.geometry.coordinates,
  }));
};

const retrieveAndFilterBuildingsResearchData = async (url) => {
  const data = await fetchData(url);
  return data.features.map((feature) => ({
    id: feature.id,
    utilization: feature.properties.np1_1f,
    roofType: feature.properties.strecha,
    floors: feature.properties.npodl,
    coordinates: feature.geometry.coordinates,
  }));
};

const retrieveAndFilterStreetsData = async (url) => {
  const data = await fetchData(url);
  return data.features.map((feature) => ({
    id: feature.id,
    name: feature.properties.nazev,
    code: feature.properties.kod,
    globalid: feature.properties.GlobalID,
    objectid: feature.properties.ObjectId,
    length: feature.properties.Shape__Length,
    coordinates: feature.geometry?.coordinates,
    geometryType: feature.geometry?.type,
  }));
};

const retrieveAndFilterTrafficDelaysData = async (url) => {
  const data = await fetchData(url);
  return data.features.map((feature) => ({
    id: feature.id,
    coordinates: feature.geometry.coordinates,
    globalid: feature.properties.globalid,
    objectid: feature.properties.objectid,
    country: feature.properties.country,
    level: feature.properties.level,
    city: feature.properties.city,
    speedKMH: feature.properties.speedKMH,
    turnType: feature.properties.turnType,
    type: feature.properties.type,
    uuid: feature.properties.uuid,
    endNode: feature.properties.endNode,
    speed: feature.properties.speed,
    blockingAlertUuid: feature.properties.blockingAlertUuid,
    roadType: feature.properties.roadType,
    delay: feature.properties.delay,
    street: feature.properties.street,
    objectid: feature.properties.objectid,
    pubMillis: feature.properties.pubMillis,
    street: feature.properties.street,
  }));
};

const retrieveAndFilterFloodZonesData = async (url) => {
  const data = await fetchData(url);
  return data.features.map((feature) => ({
    id: feature.id,
    layer: feature.properties.layer,
    coordinates: feature.geometry.coordinates,
    globalid: feature.properties.GlobalID,
    objectid: feature.properties.objectid,
  }));
};

const retrieveAndFilterPedestrianCrossingsData = async (url) => {
  const data = await fetchData(url);
  return data.features.map((feature) => ({
    id: feature.id,
    coordinates: feature.geometry.coordinates,
    globalid: feature.properties.GlobalID,
    objectid: feature.properties.ObjectId,
  }));
};

const datasets = [
  {
    name: "accessibility_buildings",
    url: "https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/mapa_pristupnosti_budovy/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    retrieveAndFilterFunc: retrieveAndFilterAccessibilityBuildingsData,
  },
  {
    name: "accessibility_entrances",
    url: "https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/vstupy_budov/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    retrieveAndFilterFunc: retrieveAndFilterAccessibilityEntrancesData,
  },
  {
    name: "public_transport_routes",
    url: "https://gis.brno.cz/ags1/rest/services/ODAE/ODAE_ids_jmk_sit/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    retrieveAndFilterFunc: retrieveAndFilterPublicTransportData,
  },
  {
    name: "buildings_research",
    url: "https://gis.brno.cz/ags1/rest/services/Hosted/KAM_pruzkum_budov_OD_WGS_Projekt/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    retrieveAndFilterFunc: retrieveAndFilterBuildingsResearchData,
  },
  {
    name: "streets",
    url: "https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/ulicni_sit/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    retrieveAndFilterFunc: retrieveAndFilterStreetsData,
  },
  {
    name: "traffic_delays",
    url: "https://gis.brno.cz/ags1/rest/services/Hosted/WazeJams/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    retrieveAndFilterFunc: retrieveAndFilterTrafficDelaysData,
  },
  {
    name: "flood_zones",
    url: "https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/zaplavova_uzemi_Q20/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    retrieveAndFilterFunc: retrieveAndFilterFloodZonesData,
  },
  {
    name: "pedestrian_crossings",
    url: "https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/prechody_pro_chodce/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    retrieveAndFilterFunc: retrieveAndFilterPedestrianCrossingsData,
  },
];

module.exports = { fetchData, updateCachedData, getCachedData };
