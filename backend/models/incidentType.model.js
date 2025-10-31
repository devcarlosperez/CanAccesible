module.exports = (sequelize, DataTypes) => {
  const IncidentType = sequelize.define('IncidentType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM('buena_practica', 'mala_practica'),
      allowNull: false,
    },
  }, {
    tableName: 'IncidentTypes',
    timestamps: true,
  });

  IncidentType.associate = (models) => {
    IncidentType.hasMany(models.Incident, { foreignKey: 'incidentTypeId', as: 'incidents' });
  };

  return IncidentType;
};
