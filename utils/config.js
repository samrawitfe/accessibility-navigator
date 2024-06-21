require("dotenv").config();
const PORT = process.env.PORT;
const CLOUDANT_APIKEY = process.env.CLOUDANT_APIKEY;
const CLOUDANT_URL = process.env.CLOUDANT_URL;
const COS_ENDPOINT = process.env.COS_ENDPOINT;
const COS_APIKEY = process.env.COS_APIKEY;
const COS_INSTANCE_ID = process.env.COS_INSTANCE_ID;
const COS_BUCKET_NAME = process.env.COS_BUCKET_NAME;

module.exports = {
  PORT,
  CLOUDANT_APIKEY,
  CLOUDANT_URL,
  COS_ENDPOINT,
  COS_APIKEY,
  COS_INSTANCE_ID,
  COS_BUCKET_NAME,
};
