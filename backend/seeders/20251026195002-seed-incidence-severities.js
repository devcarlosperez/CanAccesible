'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidenceSeverities', [
      {
        severity: 'low',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        severity: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        severity: 'high',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidenceSeverities', null, {});
  }
};
