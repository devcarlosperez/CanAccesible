'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Incidences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      incidenceStatusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'IncidenceStatuses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      incidenceSeverityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'IncidenceSeverities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      incidenceTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'IncidenceTypes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        type: Sequelize.ENUM('Gran Canaria', 'Tenerife', 'La Gomera', 'Lanzarote',
        'Fuerteventura', 'El Hierro', 'La Palma'),
        allowNull: false,
      },
      area: {
        type: Sequelize.ENUM('mobility', 'sensory', 'architecture', 'transport', 'other'),
        allowNull: false,
      },
      road: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      suburb: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cityDistrict: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      province: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postcode: {
        type: Sequelize.INTEGER,
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
      dateIncidence: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Incidences');
  }
};
