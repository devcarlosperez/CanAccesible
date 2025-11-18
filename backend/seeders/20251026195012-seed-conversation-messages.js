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
        senderId: 2,
        message: 'Bien, gracias. ¿Y tú?',
        dateMessage: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        conversationId: 1,
        senderId: 1,
        message: 'Tengo una duda, como puedo cambiar mi foto de perfil?',
        dateMessage: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        conversationId: 2,
        senderId: 3,
        message: 'Buenas, el municipio de Tenerife tiene una duda de como reportar una incidencia.',
        dateMessage: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        conversationId: 3,
        senderId: 3,
        message: 'Buenos días, tengo una duda respecto a los artículos del blog.',
        dateMessage: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ConversationMessages', null, {});
  }
};
