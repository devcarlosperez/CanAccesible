module.exports = (sequelize, DataTypes) => {
  const IncidenceComment = sequelize.define('IncidenceComment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    incidenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Incidences',
        key: 'id',
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateComment: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'IncidenceComments',
    timestamps: true,
  });

  IncidenceComment.associate = (models) => {
    IncidenceComment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    IncidenceComment.belongsTo(models.Incidence, { foreignKey: 'incidenceId', as: 'incidence' });
  };

  return IncidenceComment;
};
