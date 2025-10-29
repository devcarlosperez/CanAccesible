module.exports = (sequelize, DataTypes) => {
  const IncidenceType = sequelize.define('IncidenceType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM('bad_practise', 'good_practise'),
      allowNull: false,
    },
  }, {
    tableName: 'IncidenceTypes',
    timestamps: true,
  });

  IncidenceType.associate = (models) => {
    IncidenceType.hasMany(models.Incidence, { foreignKey: 'incidenceTypeId', as: 'incidences' });
  };

  return IncidenceType;
};
