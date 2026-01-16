'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Logs', [
      {
        userId: 2,
        action: 'CREATE',
        entity: 'User',
        entityId: 1,
        dateLog: new Date('2025-10-15 10:30:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        action: 'LOGIN',
        entity: 'User',
        entityId: 1,
        dateLog: new Date('2025-10-18 09:00:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        action: 'UPDATE',
        entity: 'User',
        entityId: 1,
        dateLog: new Date('2025-10-18 09:15:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        action: 'LOGIN',
        entity: 'User',
        entityId: 2,
        dateLog: new Date('2025-10-18 14:45:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        action: 'LOGIN',
        entity: 'User',
        entityId: 3,
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
