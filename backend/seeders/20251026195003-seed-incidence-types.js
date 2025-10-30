'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidenceTypes', [
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
    await queryInterface.bulkDelete('IncidenceTypes', null, {});
  }
};
