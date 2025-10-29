module.exports = (sequelize, DataTypes) => {
  const IncidenceStatus = sequelize.define('IncidenceStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved'),
      allowNull: false,
    },
  }, {
    tableName: 'IncidenceStatuses',
    timestamps: true,
  });

  IncidenceStatus.associate = (models) => {
    IncidenceStatus.hasMany(models.Incidence, { foreignKey: 'incidenceStatusId', as: 'incidences' });
  };

  return IncidenceStatus;
};
