'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidentFollows', [
      {
        userId: 1,
        incidentId: 1,
        dateFollowed: new Date('2025-10-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        incidentId: 1,
        dateFollowed: new Date('2025-10-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        incidentId: 2,
        dateFollowed: new Date('2025-10-18'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidentFollows', null, {});
  }
};
