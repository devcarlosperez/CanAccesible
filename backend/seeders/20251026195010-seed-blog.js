'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Blogs', [
      {
        userId: 1,
        title: 'Mejoras en accesibilidad en Tenerife',
        description: 'Este blog comparte las últimas mejoras implementadas en infraestructuras accesibles en la isla de Tenerife durante el último trimestre.',
        dateCreation: new Date('2025-10-15'),
        nameFile: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'Iniciativas de inclusión en Gran Canaria',
        description: 'Descubre las nuevas iniciativas que se están llevando a cabo para mejorar la inclusión de personas con discapacidad en Gran Canaria.',
        dateCreation: new Date('2025-10-18'),
        nameFile: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        title: 'Normas de accesibilidad en espacios públicos',
        description: 'Un análisis detallado sobre las normas y regulaciones que deben cumplir los espacios públicos para garantizar la accesibilidad.',
        dateCreation: new Date('2025-10-20'),
        nameFile: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Blogs', null, {});
  }
};
