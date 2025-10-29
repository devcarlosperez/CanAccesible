module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
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
  }, {
    tableName: 'Conversations',
    timestamps: true,
  });

  Conversation.associate = (models) => {
    Conversation.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Conversation.hasMany(models.ConversationMessage, { foreignKey: 'conversationId', as: 'messages' });
  };

  return Conversation;
};
