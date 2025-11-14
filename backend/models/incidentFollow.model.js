module.exports = (sequelize, DataTypes) => {
  const IncidentFollow = sequelize.define('IncidentFollow', {
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
    incidentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Incidents',
        key: 'id',
      },
    },
    dateFollowed: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'IncidentFollows',
    timestamps: true,
  });

  IncidentFollow.associate = (models) => {
    IncidentFollow.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    IncidentFollow.belongsTo(models.Incident, { foreignKey: 'incidentId', as: 'incident' });
  };

  return IncidentFollow;
};
