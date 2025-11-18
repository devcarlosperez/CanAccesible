"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Conversations",
      [
        {
          userId: 1,
          type: 'soporte de cuenta',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          type: 'reportar una incidencia',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          type: 'consulta general',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Conversations", null, {});
  },
};
