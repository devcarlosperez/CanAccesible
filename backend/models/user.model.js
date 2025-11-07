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
      type: DataTypes.ENUM('usuario', 'admin', 'municipio'),
      allowNull: false,
      defaultValue: 'usuario',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasMany(models.Incident, { foreignKey: 'userId', as: 'incidents' });
    User.hasMany(models.IncidentComment, { foreignKey: 'userId', as: 'comments' });
    User.hasMany(models.IncidentLike, { foreignKey: 'userId', as: 'likes' });
    User.hasMany(models.IncidentFollow, { foreignKey: 'userId', as: 'incidentFollows' });
    User.hasMany(models.Blog, { foreignKey: 'userId', as: 'blogs' });
    User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
    User.hasMany(models.Conversation, { foreignKey: 'userId', as: 'conversations' });
    User.hasMany(models.ConversationMessage, { foreignKey: 'senderId', as: 'messages' });
    User.hasMany(models.Log, { foreignKey: 'userId', as: 'logs' });
  };

  return User;
};
