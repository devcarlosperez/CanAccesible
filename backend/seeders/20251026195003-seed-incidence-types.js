'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidenceTypes', [
      {
        type: 'good_practise',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'bad_practise',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidenceTypes', null, {});
  }
};
