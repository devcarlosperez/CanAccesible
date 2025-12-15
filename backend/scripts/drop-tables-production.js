const readline = require('readline');
const path = require('path');

// Force production environment
process.env.NODE_ENV = 'production';

// Now require the db connection, which will load .env.production via config.js
const sequelize = require('../db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('WARNING: You are about to drop ALL tables in the PRODUCTION database.');
console.log(`Database: ${sequelize.config.database}`);
console.log(`Host: ${sequelize.config.host}`);

const force = process.argv.includes('-y') || process.argv.includes('--yes');

if (force) {
  (async () => {
    try {
      console.log('Force flag detected. Dropping tables...');
      // Use getQueryInterface().dropAllTables() to drop ALL tables in the DB
      await sequelize.getQueryInterface().dropAllTables();
      console.log('All tables have been dropped successfully.');
    } catch (error) {
      console.error('Error dropping tables:', error);
    } finally {
      await sequelize.close();
      rl.close();
      process.exit(0);
    }
  })();
} else {
  rl.question('Are you sure you want to proceed? Type "yes" to confirm: ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      try {
        console.log('Dropping tables...');
        // Use getQueryInterface().dropAllTables() to drop ALL tables in the DB, 
        // not just the ones defined in models.
        await sequelize.getQueryInterface().dropAllTables();
        console.log('All tables have been dropped successfully.');
      } catch (error) {
        console.error('Error dropping tables:', error);
      } finally {
        await sequelize.close();
        rl.close();
        process.exit(0);
      }
    } else {
      console.log('Operation cancelled.');
      rl.close();
      process.exit(0);
    }
  });
}
