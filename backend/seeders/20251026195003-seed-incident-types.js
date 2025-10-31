'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidentTypes', [
      {
        type: 'buena_practica',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'mala_practica',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidentTypes', null, {});
  }
};
