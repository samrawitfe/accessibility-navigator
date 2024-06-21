const { S3 } = require("ibm-cos-sdk");
const config = require("./config");

const cos = new S3({
  endpoint: config.COS_ENDPOINT,
  apiKeyId: config.COS_APIKEY,
  serviceInstanceId: config.COS_INSTANCE_ID,
});

async function uploadImage(file) {
  const params = {
    Bucket: config.COS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const data = await cos.upload(params).promise();
  return data.Location;
}

module.exports = { uploadImage };
