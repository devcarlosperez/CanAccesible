'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidentSeverities', [
      {
        severity: 'baja',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        severity: 'media',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        severity: 'alta',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidentSeverities', null, {});
  }
};
