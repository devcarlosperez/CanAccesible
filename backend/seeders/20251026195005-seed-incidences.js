'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Incidences', [
      {
        incidenceStatusId: 1,
        incidenceSeverityId: 3,
        incidenceTypeId: 2,
        userId: 2,
        name: 'Rampa insuficiente en edificio público',
        description: 'La rampa principal es muy empinada y dificulta el acceso en silla de ruedas',
        island: 'Tenerife',
        area: 'mobility',
        address: 'Calle Principal 123',
        latitude: 28.2915926,
        longitude: -16.6291304,
        dateIncidence: new Date('2025-10-15'),
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceStatusId: 2,
        incidenceSeverityId: 2,
        incidenceTypeId: 2,
        userId: 2,
        name: 'Parada de autobús sin espacio accesible',
        description: 'No hay zona adaptada para personas con movilidad reducida en la parada',
        island: 'Gran Canaria',
        area: 'mobility',
        address: 'Avenida Central 456',
        latitude: 28.2916,
        longitude: -16.6292,
        dateIncidence: new Date('2025-10-18'),
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceStatusId: 1,
        incidenceSeverityId: 1,
        incidenceTypeId: 2,
        userId: 1,
        name: 'Señalización con pictogramas confusos',
        description: 'Los símbolos de accesibilidad no son claros y generan confusión',
        island: 'Tenerife',
        area: 'sensory',
        address: 'Plaza Central 789',
        latitude: 28.2917,
        longitude: -16.6293,
        dateIncidence: new Date('2025-10-20'),
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Incidences', null, {});
  }
};