'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Incidents', [
      {
        incidentStatusId: 1,
        incidentSeverityId: 2,
        incidentTypeId: 2,
        userId: 1,
        name: 'Rampa insuficiente en edificio público',
        area: 'movilidad',
        description: 'La rampa principal es muy empinada y dificulta el acceso en silla de ruedas',
        island: 'Tenerife',
        address: 'Calle Pintor',
        latitude: 28.2915926,
        longitude: -16.6291304,
        dateIncidence: new Date('2025-10-15'),
        nameFile: null,
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidentStatusId: 3,
        incidentSeverityId: 3,
        incidentTypeId: 2,
        userId: 2,
        name: 'Parada de autobús sin espacio accesible',
        area: 'movilidad',
        description: 'No hay zona adaptada para personas con movilidad reducida en la parada',
        island: 'Gran Canaria',
        address: 'Avenida de Canarias',
        latitude: 28.2916,
        longitude: -16.6292,
        dateIncidence: new Date('2025-10-18'),
        nameFile: null,
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidentStatusId: 1,
        incidentSeverityId: 1,
        incidentTypeId: 2,
        userId: 1,
        name: 'Señalización con pictogramas confusos',
        area: 'sensorial',
        description: 'Los símbolos de accesibilidad no son claros y generan confusión',
        island: 'Tenerife',
        address: 'Calle San Sebastián',
        latitude: 28.2917,
        longitude: -16.6293,
        dateIncidence: new Date('2025-10-20'),
        nameFile: null,
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Incidents', null, {});
  }
};