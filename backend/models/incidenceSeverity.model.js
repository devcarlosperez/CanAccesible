module.exports = (sequelize, DataTypes) => {
  const IncidenceSeverity = sequelize.define('IncidenceSeverity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
    },
  }, {
    tableName: 'IncidenceSeverities',
    timestamps: true,
  });

  IncidenceSeverity.associate = (models) => {
    IncidenceSeverity.hasMany(models.Incidence, { foreignKey: 'incidenceSeverityId', as: 'incidences' });
  };

  return IncidenceSeverity;
};
