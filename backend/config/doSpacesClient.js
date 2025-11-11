const AWS = require("aws-sdk");

// Create DigitalOcean Spaces endpoint
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACE_ENDPOINT);

// Create S3 client for DO Spaces
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_ACCESS_KEY,
  secretAccessKey: process.env.DO_SECRET_KEY,
});

module.exports = s3;