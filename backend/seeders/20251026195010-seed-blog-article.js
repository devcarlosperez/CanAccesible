'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('BlogArticles', [
      {
        title: 'Mejoras en accesibilidad en Tenerife',
        description: 'Este blog comparte las últimas mejoras implementadas en infraestructuras accesibles en la isla de Tenerife durante el último trimestre.',
        content: 'Durante el último trimestre, se han implementado significativas mejoras en la accesibilidad de infraestructuras públicas en Tenerife. Estas incluyen la instalación de rampas de acceso en edificios históricos, la implementación de sistemas de audio descriptivo en museos, y la mejora de las paradas de autobús con información táctil. Estas iniciativas se alinean con los objetivos de la ONU para garantizar que las ciudades sean inclusivas, seguras y sostenibles para todos los ciudadanos, independientemente de sus capacidades físicas o sensoriales.',
        dateCreation: new Date('2025-10-15'),
        nameFile: 'blog_tenerife_mejoras_001.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Iniciativas de inclusión en Gran Canaria',
        description: 'Descubre las nuevas iniciativas que se están llevando a cabo para mejorar la inclusión de personas con discapacidad en Gran Canaria.',
        content: 'Gran Canaria ha lanzado un ambicioso programa de inclusión que abarca educación, empleo y cultura. El programa incluye talleres de concienciación, programas de empleo asistido para personas con discapacidad intelectual, y la accesibilidad mejorada en espacios culturales. Las empresas locales se han sumado a este esfuerzo mediante la adopción de políticas de contratación inclusiva. Se espera que estas iniciativas se conviertan en un modelo para otras islas del archipiélago.',
        dateCreation: new Date('2025-10-18'),
        nameFile: 'blog_grancanaria_iniciativas_001.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Normas de accesibilidad en espacios públicos',
        description: 'Un análisis detallado sobre las normas y regulaciones que deben cumplir los espacios públicos para garantizar la accesibilidad.',
        content: 'Las normas de accesibilidad en espacios públicos son fundamentales para garantizar la igualdad de oportunidades. Estas normas cubren aspectos como anchos mínimos de pasillos, altura de mostrador, sistemas de señalización visual y táctil, y acceso a servicios de transporte. Es importante que los gestores de espacios públicos comprendan estas regulaciones y las implementen correctamente. Las auditorías regulares y la retroalimentación de personas con discapacidad son esenciales para mantener y mejorar estos estándares.',
        dateCreation: new Date('2025-10-20'),
        nameFile: 'blog_normas_accesibilidad_001.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BlogArticles', null, {});
  }
};
