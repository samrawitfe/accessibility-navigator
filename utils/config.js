require("dotenv").config();
const PORT = process.env.PORT;
const CLOUDANT_APIKEY = process.env.CLOUDANT_APIKEY;
const CLOUDANT_URL = process.env.CLOUDANT_URL;

module.exports = { PORT, CLOUDANT_APIKEY, CLOUDANT_URL };
