module.exports = (sequelize, DataTypes) => {
  const IncidenceLike = sequelize.define('IncidenceLike', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    incidenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Incidences',
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
    tableName: 'IncidenceLikes',
    timestamps: true,
  });

  IncidenceLike.associate = (models) => {
    IncidenceLike.belongsTo(models.Incidence, { foreignKey: 'incidenceId', as: 'incidence' });
    IncidenceLike.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return IncidenceLike;
};
