module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
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
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity: {
      type: DataTypes.ENUM(
        'User',
        'Incident',
        'IncidentComment',
        'IncidentLike',
        'IncidentFollow',
        'Blog',
        'Notification',
        'Conversation',
        'ConversationMessage'
      ),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dateLog: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Logs',
    timestamps: true,
  });

  Log.associate = (models) => {
    Log.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Log;
};
