const cron = require('node-cron');
const { Op } = require('sequelize');
const db = require('../models');
const Log = db.log;

const scheduleLogCleanup = () => {
  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    const retentionDays = 30;
    
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - retentionDays);

    try {
      await Log.destroy({
        where: {
          dateLog: {
            [Op.lt]: dateThreshold
          }
        }
      });
    } catch (error) {
      console.error(error)
    }
  });
};

module.exports = { scheduleLogCleanup };
