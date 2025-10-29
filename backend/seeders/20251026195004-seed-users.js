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
        rol: 'user',
        password: bcrypt.hashSync('carlos2004', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Pedro',
        lastName: 'Sánchez',
        email: 'pedrosanchez@gmail.com',
        dateRegister: new Date(),
        rol: 'user',
        password: bcrypt.hashSync('gobierno_españa_2025', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Admin',
        lastName: '',
        email: 'admin@gmail.com',
        dateRegister: new Date(),
        rol: 'admin',
        password: bcrypt.hashSync('cji_canaccesible', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};