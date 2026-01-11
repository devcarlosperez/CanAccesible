const request = require('supertest');
const app = require('../index'); 
const { sequelize, user: User, conversation: Conversation, conversationMessage: ConversationMessage, role: Role } = require('../models');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');

describe('ConversationMessage API (JWT Auth)', () => {
  let userToken;
  let userId;
  let conversationId;
  let messageId;

  beforeAll(async () => {
    // 1. Find an existing conversation (using data from seeders)
    const conversation = await Conversation.findOne();
    
    if (!conversation) {
      throw new Error('No conversations found in DB. Make sure to run seeders: npm run db:seed:test');
    }

    conversationId = conversation.id;
    userId = conversation.userId;
    
    // 2. Get the owner of that conversation
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User for existing conversation not found.');
    }

    // 3. Generate token for that user
    userToken = jwt.sign(
      { id: user.id, email: user.email, role: 'usuario' },
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
