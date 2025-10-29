const sequelize = require('../db');
const DataTypes = require('sequelize').DataTypes;

// Import all models
const user = require('./user.model')(sequelize, DataTypes);
const incidenceStatus = require('./incidenceStatus.model')(sequelize, DataTypes);
const incidenceSeverity = require('./incidenceSeverity.model')(sequelize, DataTypes);
const incidenceType = require('./incidenceType.model')(sequelize, DataTypes);
const incidence = require('./incidence.model')(sequelize, DataTypes);
const incidenceComment = require('./incidenceComment.model')(sequelize, DataTypes);
const incidenceLike = require('./incidenceLike.model')(sequelize, DataTypes);
const multimedia = require('./multimedia.model')(sequelize, DataTypes);
const notification = require('./notification.model')(sequelize, DataTypes);
const conversation = require('./conversation.model')(sequelize, DataTypes);
const conversationMessage = require('./conversationMessage.model')(sequelize, DataTypes);

// Execute associations
Object.values(sequelize.models).forEach(model => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

// Export all models
module.exports = {
  sequelize,
  user,
  incidenceStatus,
  incidenceSeverity,
  incidenceType,
  incidence,
  incidenceComment,
  incidenceLike,
  multimedia,
  notification,
  conversation,
  conversationMessage,
};