// models/place.model.js
const placeSchema = {
    place_id: String,
    place_name: String,
    place_address: String,
    place_type: String,
    accessibility_data: Object,
    geometry: Object,
  };
  
  module.exports = placeSchema;
  