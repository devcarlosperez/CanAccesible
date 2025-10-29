'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ConversationMessages', [
      {
        conversationId: 1,
        senderId: 1,
        message: 'Hola, ¿cómo estás?',
        dateMessage: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        conversationId: 1,
        senderId: 3,
        message: 'Bien, gracias. ¿Y tú?',
        dateMessage: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ConversationMessages', null, {});
  }
};
