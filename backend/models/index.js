const sequelize = require('../db');
const DataTypes = require('sequelize').DataTypes;

// Import all models
const user = require('./user.model')(sequelize, DataTypes);
const incidentStatus = require('./incidentStatus.model')(sequelize, DataTypes);
const incidentSeverity = require('./incidentSeverity.model')(sequelize, DataTypes);
const incidentType = require('./incidentType.model')(sequelize, DataTypes);
const incident = require('./incident.model')(sequelize, DataTypes);
const incidentComment = require('./incidentComment.model')(sequelize, DataTypes);
const incidentLike = require('./incidentLike.model')(sequelize, DataTypes);
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
  incidentStatus,
  incidentSeverity,
  incidentType,
  incident,
  incidentComment,
  incidentLike,
  multimedia,
  notification,
  conversation,
  conversationMessage,
};