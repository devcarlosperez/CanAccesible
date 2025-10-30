module.exports = (sequelize, DataTypes) => {
  const Incidence = sequelize.define('Incidence', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    incidenceStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'IncidenceStatuses',
        key: 'id',
      },
    },
    incidenceSeverityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'IncidenceSeverities',
        key: 'id',
      },
    },
    incidenceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'IncidenceTypes',
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    island: {
      type: DataTypes.ENUM('Gran Canaria', 'Tenerife', 'La Gomera', 'Lanzarote', 'Fuerteventura', 'El Hierro', 'La Palma'),
      allowNull: false,
    },
    area: {
      type: DataTypes.ENUM('mobility', 'sensory', 'architecture', 'transport', 'other'),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    dateIncidence: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'Incidences',
    timestamps: true,
  });

  Incidence.associate = (models) => {
    Incidence.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Incidence.belongsTo(models.IncidenceStatus, { foreignKey: 'incidenceStatusId', as: 'status' });
    Incidence.belongsTo(models.IncidenceSeverity, { foreignKey: 'incidenceSeverityId', as: 'severity' });
    Incidence.belongsTo(models.IncidenceType, { foreignKey: 'incidenceTypeId', as: 'type' });
    Incidence.hasMany(models.IncidenceComment, { foreignKey: 'incidenceId', as: 'comments' });
    Incidence.hasMany(models.IncidenceLike, { foreignKey: 'incidenceId', as: 'likes' });
    Incidence.hasMany(models.Multimedia, { foreignKey: 'incidenceId', as: 'multimedias' });
  };

  return Incidence;
};
