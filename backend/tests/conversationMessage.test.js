const request = require('supertest');
const app = require('../index'); // Ensure app is exported in index.js
const { sequelize, User, Conversation, ConversationMessage, Role } = require('../models');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');

describe('ConversationMessage API (JWT Auth)', () => {
  let userToken;
  let userId;
  let conversationId;
  let messageId;

  beforeAll(async () => {
    // 1. Find an existing Conversation (populated by seeders)
    const conversation = await Conversation.findOne();
    if (!conversation) {
      throw new Error('No conversation found in DB. Ensure seeders are run.');
    }
    conversationId = conversation.id;

    // 2. Find the owner of that conversation to generate the token
    const user = await User.findByPk(conversation.userId, {
      include: [{ model: Role, as: 'role' }] 
    });
    
    if (!user) {
      throw new Error('User for the conversation not found.');
    }
    userId = user.id;

    // 3. Create JWT Token for that existing user
    userToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role ? user.role.role : 'usuario' },
      jwtConfig.secret
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // 1. CREATE (POST)
  test('POST /api/conversationMessages/:conversationId - Should create a message', async () => {
    const res = await request(app)
      .post(`/api/conversationMessages/${conversationId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        message: 'Hello, I have an issue here.'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.message).toBe('Hello, I have an issue here.');
    messageId = res.body.id; // Save ID for next tests
  });

  // 2. READ (GET All)
  test('GET /api/conversationMessages/:conversationId - Should list messages', async () => {
    const res = await request(app)
      .get(`/api/conversationMessages/${conversationId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].message).toBe('Hello, I have an issue here.');
  });
  
  // 4. UPDATE (PUT)
  test('PUT /api/conversationMessages/:conversationId/:id - Should update a message', async () => {
    const res = await request(app)
      .put(`/api/conversationMessages/${conversationId}/${messageId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        message: 'Edited message'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Edited message');
  });

  // 5. DELETE (DELETE)
  test('DELETE /api/conversationMessages/:conversationId/:id - Should delete a message', async () => {
    const res = await request(app)
      .delete(`/api/conversationMessages/${conversationId}/${messageId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
  });

  // 6. ERROR HANDLING (Validation)
  test('POST /api/conversationMessages/:conversationId - Should fail if message is empty', async () => {
    const res = await request(app)
      .post(`/api/conversationMessages/${conversationId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({}); // Empty body

    expect(res.statusCode).toEqual(400); // Bad Request
  });

  // 7. ERROR HANDLING (Unauthorized)
  test('GET /api/conversationMessages/:conversationId - Should fail without token', async () => {
    const res = await request(app)
      .get(`/api/conversationMessages/${conversationId}`);
      // No Authorization header

    expect(res.statusCode).toEqual(403); // Forbidden/Unauthorized
  });
});
