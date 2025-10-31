module.exports = (sequelize, DataTypes) => {
  const Multimedia = sequelize.define('Multimedia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    incidenceId: {
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    altText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Multimedias',
    timestamps: true,
  });

  Multimedia.associate = (models) => {
    Multimedia.belongsTo(models.Incident, { foreignKey: 'incidenceId', as: 'incident' });
    Multimedia.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Multimedia;
};
