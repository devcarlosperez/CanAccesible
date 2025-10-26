'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidenceStatuses', [
      {
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'in_progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'resolved',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidenceStatuses', null, {});
  }
};
