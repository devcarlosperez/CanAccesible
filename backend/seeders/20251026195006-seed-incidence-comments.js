'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidenceComments', [
      {
        userId: 2,
        incidenceId: 1,
        comment: 'Es urgente solucionar este problema, afecta a muchas personas',
        dateComment: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        incidenceId: 1,
        comment: 'Totalmente de acuerdo, llevo años pidiendo una rampa',
        dateComment: new Date('2025-10-17'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        incidenceId: 2,
        comment: 'Desde mi punto de vista necesita urgencia alta',
        dateComment: new Date('2025-10-19'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidenceComments', null, {});
  }
};
