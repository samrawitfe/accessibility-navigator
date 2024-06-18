// utils/cloudant.js
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('@ibm-cloud/cloudant/auth');
require('dotenv').config();

const client = CloudantV1.newInstance({
    authenticator: new IamAuthenticator({
      apikey: process.env.CLOUDANT_APIKEY,
    }),
    serviceUrl: process.env.CLOUDANT_URL,
  });
  
  const userDbName = 'users';
  const reviewDbName = 'reviews';
  const placeDbName = 'places';
  
  const createDatabase = async (dbName) => {
    try {
      await client.putDatabase({ db: dbName });
      console.log(`Database ${dbName} created or already exists.`);
    } catch (err) {
      if (err.code !== 412) {
        console.error('Error creating database:', err);
      }
    }
  };
  
  createDatabase(userDbName);
  createDatabase(reviewDbName);
  createDatabase(placeDbName);
  
  module.exports = {
    client,
    userDbName,
    reviewDbName,
    placeDbName,
  };
  
