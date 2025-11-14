'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notifications', [
      {
        userId: 2,
        entity: 'Incident',
        entityId: 1,
        message: 'Tu incidencia "Escaleras sin rampa" ha sido aprobada',
        dateNotification: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        entity: 'IncidentComment',
        entityId: 1,
        message: 'Nueva respuesta a tu incidencia "Parada de autobús sin accesibilidad"',
        dateNotification: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications', null, {});
  }
};
