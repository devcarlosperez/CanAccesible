'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Conversations', [
      {
        userId: 1,
        type: 'consulta general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        type: 'soporte de cuenta',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Conversations', null, {});
  }
};
