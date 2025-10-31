module.exports = (sequelize, DataTypes) => {
  const IncidentStatus = sequelize.define('IncidentStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'en progreso', 'resuelta'),
      allowNull: false,
    },
  }, {
    tableName: 'IncidentStatuses',
    timestamps: true,
  });

  IncidentStatus.associate = (models) => {
    IncidentStatus.hasMany(models.Incident, { foreignKey: 'incidentStatusId', as: 'incidents' });
  };

  return IncidentStatus;
};
