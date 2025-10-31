module.exports = (sequelize, DataTypes) => {
  const Incident = sequelize.define(
    "Incident",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      incidentStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "IncidentStatuses",
          key: "id",
        },
      },
      incidentSeverityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "IncidentSeverities",
          key: "id",
        },
      },
      incidentTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "IncidentTypes",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
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
        type: DataTypes.ENUM(
          "Gran Canaria",
          "Tenerife",
          "La Gomera",
          "Lanzarote",
          "Fuerteventura",
          "El Hierro",
          "La Palma"
        ),
        allowNull: false,
      },
      area: {
        type: DataTypes.ENUM(
          "movilidad",
          "sensorial",
          "arquitectura",
          "transporte",
          "otro"
        ),
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
      dateIncident: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Incidents",
      timestamps: true,
    }
  );

  Incident.associate = (models) => {
    Incident.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Incident.belongsTo(models.IncidentStatus, {
      foreignKey: "incidentStatusId",
      as: "status",
    });
    Incident.belongsTo(models.IncidentSeverity, {
      foreignKey: "incidentSeverityId",
      as: "severity",
    });
    Incident.belongsTo(models.IncidentType, {
      foreignKey: "incidentTypeId",
      as: "type",
    });
    Incident.hasMany(models.IncidentComment, {
      foreignKey: "incidentId",
      as: "comments",
    });
    Incident.hasMany(models.IncidentLike, {
      foreignKey: "incidentId",
      as: "likes",
    });
    Incident.hasMany(models.Multimedia, {
      foreignKey: "incidentId",
      as: "multimedias",
    });
  };

  return Incident;
};
