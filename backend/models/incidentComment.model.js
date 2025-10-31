module.exports = (sequelize, DataTypes) => {
  const IncidentComment = sequelize.define('IncidentComment', {
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
    incidentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Incidents',
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
    tableName: 'IncidentComments',
    timestamps: true,
  });

  IncidentComment.associate = (models) => {
    IncidentComment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    IncidentComment.belongsTo(models.Incident, { foreignKey: 'incidentId', as: 'incident' });
  };

  return IncidentComment;
};
