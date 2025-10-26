'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidenceTypes', [
      {
        type: 'architectural',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'transport',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'signage',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'public_space',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'technological',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'sensory',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'good_practise',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidenceTypes', null, {});
  }
};
