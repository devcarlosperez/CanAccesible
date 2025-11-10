'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Carlos',
        lastName: 'Pérez Santana',
        email: 'carlos@gmail.com',
        dateRegister: new Date(),
        roleId: 1,
        password: bcrypt.hashSync('carlos2004', 10),
        nameFile: 'profile_carlos_001.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Pedro',
        lastName: 'Sánchez',
        email: 'pedrosanchez@gmail.com',
        dateRegister: new Date(),
        roleId: 1,
        password: bcrypt.hashSync('gobierno_españa_2025', 10),
        nameFile: 'profile_pedro_001.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Admin',
        lastName: '',
        email: 'admin@gmail.com',
        dateRegister: new Date(),
        roleId: 2,
        password: bcrypt.hashSync('cji_canaccesible', 10),
        nameFile: 'profile_admin_001.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Municipio',
        lastName: 'Santa Cruz de Tenerife',
        email: 'municipio@santacruz.es',
        dateRegister: new Date(),
        roleId: 3,
        password: bcrypt.hashSync('municipio_2025', 10),
        nameFile: 'profile_municipio_001.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};