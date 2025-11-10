'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        role: 'usuario',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'municipio',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
