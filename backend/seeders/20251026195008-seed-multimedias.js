'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Multimedias', [
      {
        incidenceId: 1,
        userId: 2,
        type: 'image',
        url: 'https://example.com/media/escaleras-rampa-001.jpg',
        altText: 'Foto de escaleras sin rampa en acceso principal',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceId: 1,
        userId: 2,
        type: 'image',
        url: 'https://example.com/media/escaleras-rampa-002.jpg',
        altText: 'Detalle de los escalones sin acceso',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceId: 2,
        userId: 1,
        type: 'image',
        url: 'https://example.com/media/parada-autobus-001.jpg',
        altText: 'Foto de parada de autobús sin accesibilidad',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Multimedias', null, {});
  }
};
