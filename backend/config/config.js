const dotenv = require('dotenv');

const env = process.env.NODE_ENV;

dotenv.config({ path: env === 'production' ? '.env.production' : '.env.development' });

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};

module.exports = config[env];