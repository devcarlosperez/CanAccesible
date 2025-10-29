module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    dateRegister: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    rol: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasMany(models.Incidence, { foreignKey: 'userId', as: 'incidences' });
    User.hasMany(models.IncidenceComment, { foreignKey: 'userId', as: 'comments' });
    User.hasMany(models.IncidenceLike, { foreignKey: 'userId', as: 'likes' });
    User.hasMany(models.Multimedia, { foreignKey: 'userId', as: 'multimedias' });
    User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
    User.hasMany(models.Conversation, { foreignKey: 'userId', as: 'conversations' });
    User.hasMany(models.ConversationMessage, { foreignKey: 'senderId', as: 'messages' });
  };

  return User;
};
