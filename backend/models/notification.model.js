module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    entity: {
      type: DataTypes.ENUM(
        'User',
        'Incident',
        'IncidentComment',
        'IncidentLike',
        'IncidentFollow',
        'Blog',
        'Conversation',
        'ConversationMessage'
      ),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateNotification: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Notifications',
    timestamps: true,
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Notification;
};
