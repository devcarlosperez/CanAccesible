module.exports = (sequelize, DataTypes) => {
  const ConversationMessage = sequelize.define('ConversationMessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id',
      },
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateMessage: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'ConversationMessages',
    timestamps: true,
  });

  ConversationMessage.associate = (models) => {
    ConversationMessage.belongsTo(models.Conversation, { foreignKey: 'conversationId', as: 'conversation' });
    ConversationMessage.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
  };

  return ConversationMessage;
};
