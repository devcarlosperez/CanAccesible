"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Incidents", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      incidentStatusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "IncidentStatuses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      incidentSeverityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "IncidentSeverities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      incidentTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "IncidentTypes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      island: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM(
          "movilidad",
          "sensorial",
          "arquitectura",
          "transporte",
          "otro"
        ),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      dateIncident: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      nameFile: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Incidents");
  },
};
