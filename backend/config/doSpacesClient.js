const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// Create S3 client for DO Spaces (v3 SDK)
const s3 = new S3Client({
  region: "fra1",
  endpoint: "https://fra1.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY,
    secretAccessKey: process.env.DO_SECRET_KEY,
  },
});

// Utility function to delete image from DO Spaces
async function deleteImageFromStorage(nameFile) {
  if (!nameFile) return;

  // Use env var or fallback to the name provided by user
  const bucketName = process.env.DO_SPACE_NAME || "images-cruds";
  let key;

  try {
    // Try to parse as URL
    const url = new URL(nameFile);
    key = url.pathname.substring(1); // Remove leading '/'
    
    // Decode URI components (e.g., %20 -> space)
    key = decodeURIComponent(key);

    // Check if the key starts with the bucket name (Path-style URL)
    if (key.startsWith(`${bucketName}/`)) {
      key = key.replace(`${bucketName}/`, "");
    }
  } catch (e) {
    key = nameFile;
  }

  console.log(`[DO Spaces] Attempting to delete. Bucket: ${bucketName}, Key: ${key}`);

  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }));
    console.log(`[DO Spaces] Successfully deleted image: ${key}`);
  } catch (err) {
    console.error(`[DO Spaces] Error deleting image (Bucket: ${bucketName}, Key: ${key}):`, err.message);
  }
}

module.exports = { s3, deleteImageFromStorage };
