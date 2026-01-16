const webpush = require('web-push');
const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, "..", `.env.${env}`);
dotenv.config({ path: envPath });

// VAPID Keys should be stored in environment variables
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:canaccesible@gmail.com',
  publicVapidKey,
  privateVapidKey
);

module.exports = webpush;
