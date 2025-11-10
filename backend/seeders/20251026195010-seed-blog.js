'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Blogs', [
      {
        title: 'Mejoras en accesibilidad en Tenerife',
        description: 'Este blog comparte las últimas mejoras implementadas en infraestructuras accesibles en la isla de Tenerife durante el último trimestre.',
        dateCreation: new Date('2025-10-15'),
        nameFile: 'blog_tenerife_mejoras_001.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Iniciativas de inclusión en Gran Canaria',
        description: 'Descubre las nuevas iniciativas que se están llevando a cabo para mejorar la inclusión de personas con discapacidad en Gran Canaria.',
        dateCreation: new Date('2025-10-18'),
        nameFile: 'blog_grancanaria_iniciativas_001.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Normas de accesibilidad en espacios públicos',
        description: 'Un análisis detallado sobre las normas y regulaciones que deben cumplir los espacios públicos para garantizar la accesibilidad.',
        dateCreation: new Date('2025-10-20'),
        nameFile: 'blog_normas_accesibilidad_001.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Blogs', null, {});
  }
};
