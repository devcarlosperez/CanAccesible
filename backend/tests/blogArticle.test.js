const request = require('supertest');
const app = require('../index');
const { sequelize, BlogArticle } = require('../models');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');
const { verifySession } = require('../middlewares/auth.middleware');

describe('BlogArticle API Tests', () => {
  let server;
  let adminToken;
  let userToken;
  let sessionStub;

  beforeAll(async () => {
    server = app.listen(3001);

    adminToken = jwt.sign(
      { id: 1, email: 'admin@gmail.com', role: 'admin' },
      jwtConfig.secret
    );
    userToken = jwt.sign(
      { id: 2, email: 'carlos@gmail.com', role: 'usuario' },
      jwtConfig.secret
    );
  });

  afterAll(async () => {
    server.close();
    await sequelize.close();
  });

  describe('Bearer Token Authentication', () => {
    // For Bearer token tests, we need to temporarily replace verifySession with verifyToken
    // Let's create alternative routes or mock the middleware

    beforeAll(() => {
      // Mock verifySession to use JWT verification for these tests
      sessionStub = sinon.stub().callsFake((req, res, next) => {
        let token = req.headers["authorization"];
        if (token && token.startsWith("Bearer ")) {
          token = token.slice(7, token.length);
        }

        if (!token) {
          return res.status(403).json({ message: "Token not provided." });
        }

        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: "Invalid token." });
          }
          req.user = decoded;
          next();
        });
      });
    });

    afterAll(() => {
      sessionStub.restore();
    });

    // ... existing Bearer tests ...
  });

  describe('Session-based Authentication (Dashboard)', () => {
    beforeEach(() => {
      // Restore original verifySession for session tests
      sessionStub.restore();
    });

    afterEach(() => {
      // Re-stub for Bearer tests
      sessionStub = sinon.stub().callsFake((req, res, next) => {
        req.session = {
          userId: 1,
          email: 'admin@gmail.com',
          role: 'admin'
        };
        next();
      });
    });

    // ... existing session tests ...
  });

  describe('Bearer Token Authentication', () => {
    describe('GET /api/blogArticles', () => {
      it('should return all blog articles', async () => {
        const response = await request(app)
          .get('/api/blogArticles')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('GET /api/blogArticles/:id', () => {
      it('should return a blog article by id', async () => {
        // First create an article
        const article = await BlogArticle.create({
          title: 'Test Article',
          description: 'Test Description',
          content: 'Test Content',
          dateCreation: new Date(),
          nameFile: 'test-image.jpg'
        });

        const response = await request(app)
          .get(`/api/blogArticles/${article.id}`)
          .expect(200);

        expect(response.body.title).toBe('Test Article');
      });

      it('should return 404 for non-existent article', async () => {
        await request(app)
          .get('/api/blogArticles/999')
          .expect(404);
      });
    });

    describe('POST /api/blogArticles', () => {
      it('should create a blog article with admin token', async () => {
        const response = await request(app)
          .post('/api/blogArticles')
          .set('Authorization', `Bearer ${adminToken}`)
          .field('title', 'New Article')
          .field('description', 'New Description')
          .field('content', 'New Content')
          .field('dateCreation', new Date().toISOString())
          .attach('image', Buffer.from('fake image'), 'test.jpg')
          .expect(201);

        expect(response.body.title).toBe('New Article');
      });

      it('should reject creation without admin token', async () => {
        await request(app)
          .post('/api/blogArticles')
          .set('Authorization', `Bearer ${userToken}`)
          .field('title', 'New Article')
          .field('description', 'New Description')
          .field('content', 'New Content')
          .field('dateCreation', new Date().toISOString())
          .attach('image', Buffer.from('fake image'), 'test.jpg')
          .expect(403);
      });
    });

    describe('PUT /api/blogArticles/:id', () => {
      it('should update a blog article with admin token', async () => {
        const article = await BlogArticle.create({
          title: 'Original Title',
          description: 'Original Description',
          content: 'Original Content',
          dateCreation: new Date(),
          nameFile: 'original.jpg'
        });

        const response = await request(app)
          .put(`/api/blogArticles/${article.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .field('title', 'Updated Title')
          .expect(200);

        expect(response.body.title).toBe('Updated Title');
      });

      it('should reject update without admin token', async () => {
        const article = await BlogArticle.create({
          title: 'Original Title',
          description: 'Original Description',
          content: 'Original Content',
          dateCreation: new Date(),
          nameFile: 'original.jpg'
        });

        await request(app)
          .put(`/api/blogArticles/${article.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .field('title', 'Updated Title')
          .expect(403);
      });
    });

    describe('DELETE /api/blogArticles/:id', () => {
      it('should delete a blog article with admin token', async () => {
        const article = await BlogArticle.create({
          title: 'Article to Delete',
          description: 'Description',
          content: 'Content',
          dateCreation: new Date(),
          nameFile: 'delete.jpg'
        });

        await request(app)
          .delete(`/api/blogArticles/${article.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        const deleted = await BlogArticle.findByPk(article.id);
        expect(deleted).toBeNull();
      });

      it('should reject deletion without admin token', async () => {
        const article = await BlogArticle.create({
          title: 'Article to Delete',
          description: 'Description',
          content: 'Content',
          dateCreation: new Date(),
          nameFile: 'delete.jpg'
        });

        await request(app)
          .delete(`/api/blogArticles/${article.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });
    });
  });

  describe('Session-based Authentication (Dashboard)', () => {
    describe('POST /api/blogArticles (Session)', () => {
      it('should create a blog article with admin session', async () => {
        // Mock session by stubbing the middleware
        const originalVerifySession = require('../middlewares/auth.middleware').verifySession;
        require('../middlewares/auth.middleware').verifySession = (req, res, next) => {
          req.session = {
            userId: 1,
            email: 'admin@gmail.com',
            role: 'admin'
          };
          req.user = {
            id: 1,
            email: 'admin@gmail.com',
            role: 'admin'
          };
          next();
        };

        const response = await request(app)
          .post('/api/blogArticles')
          .field('title', 'Session Article')
          .field('description', 'Session Description')
          .field('content', 'Session Content')
          .field('dateCreation', new Date().toISOString())
          .attach('image', Buffer.from('fake image'), 'test.jpg')
          .expect(201);

        expect(response.body.title).toBe('Session Article');

        // Restore original middleware
        require('../middlewares/auth.middleware').verifySession = originalVerifySession;
      });
    });

    // Similar approach for other session tests...
  });
});