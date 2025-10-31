module.exports = (sequelize, DataTypes) => {
  const IncidentSeverity = sequelize.define('IncidentSeverity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    severity: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      allowNull: false,
    },
  }, {
    tableName: 'IncidentSeverities',
    timestamps: true,
  });

  IncidentSeverity.associate = (models) => {
    IncidentSeverity.hasMany(models.Incident, { foreignKey: 'incidentSeverityId', as: 'incidents' });
  };

  return IncidentSeverity;
};
