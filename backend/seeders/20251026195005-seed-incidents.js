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
        dateIncident: new Date('2025-10-15'),
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/incident-image/rampa-de-acceso-al-portal-del-edificio-1.webp',
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
        latitude: 28.0997,
        longitude: -15.4134,
        dateIncident: new Date('2025-10-18'),
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/incident-image/parada-autobus.jpg',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidentStatusId: 1,
        incidentSeverityId: 1,
        incidentTypeId: 2,
        userId: 1,
        name: 'Ascensor sin audio para personas con discapacidad visual',
        area: 'sensorial',
        description: 'El ascensor del centro comercial no tiene sistema de audio que indique el piso actual, dificultando la navegación para personas con discapacidad visual',
        island: 'Tenerife',
        address: 'Centro Comercial Meridiano',
        latitude: 28.2917,
        longitude: -16.6293,
        dateIncident: new Date('2025-10-20'),
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/incident-image/ascensor.webp',
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