'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidentStatuses', [
      {
        status: 'pendiente',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'en_progreso',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'resuelta',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidentStatuses', null, {});
  }
};
