module.exports = (sequelize, DataTypes) => {
  const IncidentLike = sequelize.define('IncidentLike', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    incidentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Incidents',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    dateLike: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'IncidentLikes',
    timestamps: true,
  });

  IncidentLike.associate = (models) => {
    IncidentLike.belongsTo(models.Incident, { foreignKey: 'incidentId', as: 'incident' });
    IncidentLike.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return IncidentLike;
};
