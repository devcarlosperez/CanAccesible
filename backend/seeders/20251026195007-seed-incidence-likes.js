'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidenceLikes', [
      {
        incidenceId: 1,
        userId: 2,
        dateLike: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceId: 1,
        userId: 2,
        dateLike: new Date('2025-10-16'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceId: 1,
        userId: 1,
        dateLike: new Date('2025-10-17'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceId: 2,
        userId: 1,
        dateLike: new Date('2025-10-18'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceId: 2,
        userId: 1,
        dateLike: new Date('2025-10-25'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidenceLikes', null, {});
  }
};
