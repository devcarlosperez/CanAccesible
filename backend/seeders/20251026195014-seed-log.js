'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Logs', [
      {
        userId: 1,
        action: 'CREATE',
        entity: 'Incident',
        entityId: 1,
        dateLog: new Date('2025-10-15 10:30:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        action: 'CREATE',
        entity: 'Incident',
        entityId: 2,
        dateLog: new Date('2025-10-18 14:45:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        action: 'UPDATE',
        entity: 'Incident',
        entityId: 1,
        dateLog: new Date('2025-10-15 11:00:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Logs', null, {});
  }
};
