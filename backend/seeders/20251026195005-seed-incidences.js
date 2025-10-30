'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // resolver ids referenciados (status, severity, type, users)
    const statuses = await queryInterface.sequelize.query(
      'SELECT id, status FROM IncidenceStatuses',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const severities = await queryInterface.sequelize.query(
      'SELECT id, severity FROM IncidenceSeverities',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const types = await queryInterface.sequelize.query(
      'SELECT id, type FROM IncidenceTypes',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const users = await queryInterface.sequelize.query(
      'SELECT id, email FROM Users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const findStatusId = (name) => (statuses.find(s => s.status === name) || statuses[0] || {}).id;
    const findSeverityId = (name) => (severities.find(s => s.severity === name) || severities[0] || {}).id;
    const findTypeId = () => (types[0] || {}).id;
    const findUserId = (email) => (users.find(u => u.email === email) || users[0] || {}).id;

    const pendingId = findStatusId('pending');
    const inProgressId = findStatusId('in_progress');
    const lowId = findSeverityId('low');
    const medId = findSeverityId('medium');
    const highId = findSeverityId('high');
    const anyTypeId = findTypeId();
    const carlosId = findUserId('carlos@gmail.com');
    const pedroId = findUserId('pedrosanchez@gmail.com');

    await queryInterface.bulkInsert('Incidences', [
      {
        incidenceStatusId: pendingId,
        incidenceSeverityId: highId,
        incidenceTypeId: anyTypeId,
        userId: pedroId,
        name: 'Rampa insuficiente en edificio público',
        description: 'La rampa principal es muy empinada y dificulta el acceso en silla de ruedas',
        island: 'Tenerife',
        area: 'mobility',
        road: 'Calle Principal',
        suburb: 'Centro',
        cityDistrict: 'Distrito Centro',
        city: 'Santa Cruz de Tenerife',
        province: 'Santa Cruz de Tenerife',
        postcode: 38001,
        latitude: 28.2915926,
        longitude: -16.6291304,
        dateIncidence: new Date('2025-10-15'),
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceStatusId: inProgressId,
        incidenceSeverityId: medId,
        incidenceTypeId: anyTypeId,
        userId: pedroId,
        name: 'Parada de autobús sin espacio accesible',
        description: 'No hay zona adaptada para personas con movilidad reducida en la parada',
        island: 'Gran Canaria',
        area: 'mobility',
        road: 'Avenida de Canarias',
        suburb: 'Las Canteras',
        cityDistrict: 'Playa',
        city: 'Las Palmas de Gran Canaria',
        province: 'Las Palmas',
        postcode: 35001,
        latitude: 28.2916,
        longitude: -16.6292,
        dateIncidence: new Date('2025-10-18'),
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        incidenceStatusId: pendingId,
        incidenceSeverityId: lowId,
        incidenceTypeId: anyTypeId,
        userId: carlosId,
        name: 'Señalización con pictogramas confusos',
        description: 'Los símbolos de accesibilidad no son claros y generan confusión',
        island: 'Tenerife',
        area: 'sensory',
        road: 'Calle San Sebastián',
        suburb: 'Barrio Histórico',
        cityDistrict: 'Este',
        city: 'La Laguna',
        province: 'Santa Cruz de Tenerife',
        postcode: 38100,
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