const db = require('../models');
const Log = db.log;

// Creates a log record in the database
const createLog = async (userId, action, entity, entityId) => {
  try {
    const log = await Log.create({
      userId,
      action,
      entity,
      entityId,
      dateLog: new Date(),
    });
    return log;
  } catch (error) {
    // If error occurs, return null to avoid blocking the main action
    console.error('Error creating log:', error.message);
    return null;
  }
};

module.exports = { createLog };
