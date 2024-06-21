const config = require("./config");
const logger = require("./logger");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("@ibm-cloud/cloudant/auth");

const client = CloudantV1.newInstance({
  authenticator: new IamAuthenticator({
    apikey: config.CLOUDANT_APIKEY,
  }),
  serviceUrl: config.CLOUDANT_URL,
});

async function ensureDatabase(dbName) {
  try {
    await client.getDatabaseInformation({ db: dbName });
  } catch (error) {
    if (error.status === 404) {
      await client.putDatabase({ db: dbName });
    } else {
      logger.error(`Error checking/creating database ${dbName}: ${error}`);
      throw error;
    }
  }
}

function splitDataIntoChunks(data, maxSize) {
  const jsonData = JSON.stringify(data);
  const chunks = [];
  for (let i = 0; i < jsonData.length; i += maxSize) {
    chunks.push(jsonData.slice(i, i + maxSize));
  }
  return chunks;
}

async function storeData(dbName, data) {
  await ensureDatabase(dbName);
  try {
    await client.postDocument({ db: dbName, document: data });
  } catch (error) {
    if (error.status === 413) {
      logger.error("Data too large, splitting into smaller chunks.");

      const chunks = splitDataIntoChunks(data, 1000000); // 1MB chunks

      const promises = chunks.map((chunk, index) => {
        return client.postDocument({
          db: dbName,
          document: {
            _id: `${data.id}_chunk_${index}`,
            data: chunk,
            parentId: data.id,
            chunkIndex: index,
          },
        });
      });

      try {
        await Promise.all(promises);
      } catch (chunkError) {
        logger.error(`Error storing data chunks in Cloudant: ${chunkError}`);
        throw chunkError;
      }
    } else {
      logger.error(`Error storing data in Cloudant: ${error}`);
      throw error;
    }
  }
  logger.info(`Data stored in Cloudant: ${data.id}`);
}

async function getData(dbName) {
  await ensureDatabase(dbName);
  try {
    const response = await client.postAllDocs({
      db: dbName,
      includeDocs: true,
    });
    return response.result.rows.map((row) => row.doc);
  } catch (error) {
    logger.error(`Error getting data from Cloudant: ${error}`);
    throw error;
  }
}

async function clearData(dbName) {
  await ensureDatabase(dbName);
  try {
    const response = await client.postAllDocs({
      db: dbName,
      includeDocs: true,
    });

    const docsToDelete = response.result.rows.map((row) => {
      return {
        _id: row.id,
        _rev: row.doc._rev,
        _deleted: true,
      };
    });

    if (docsToDelete.length > 0) {
      await client.postBulkDocs({
        db: dbName,
        bulkDocs: { docs: docsToDelete },
      });
    }
  } catch (error) {
    logger.error(`Error clearing data in Cloudant: ${error}`);
    throw error;
  }
}

module.exports = {
  getData,
  storeData,
  clearData,
};
