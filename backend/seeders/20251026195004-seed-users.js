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
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/user-image/young-man-on-blue-background--headshot.jpg',
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
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/user-image/headshot-of-woman-on-a-white-background.jpg',
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
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/user-image/Ayuntamiento,_Santa_Cruz_de_Tenerife,_Espa%C3%B1a,_2012-12-15,_DD_01.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};