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
    type: {
      type: DataTypes.ENUM('soporte de cuenta', 'reportar una incidencia', 'recursos de accesibilidad', 'consulta general'),
      allowNull: false,
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
