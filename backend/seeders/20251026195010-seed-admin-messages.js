'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('AdminMessages', [
      {
        userId: 2,
        title: 'Duda Incidencias Municipio de Telde',
        message: 'Buenas tardes. Me gustaría conocer la situación de las incidencias por problemas de transporte en el municipio de Telde.',
        dateMessage: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        title: 'Colaboración con Canaccesible',
        message: 'Buenos días, como jefe de estudios del instituto IES El Rincón, me gustaría ponerme en contacto con vosotros para una futura colaboración.',
        dateMessage: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('AdminMessages', null, {});
  }
};
