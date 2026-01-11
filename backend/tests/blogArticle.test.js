// Mock authentication BEFORE importing the app
jest.mock('../middlewares/auth.middleware', () => {
  const originalModule = jest.requireActual('../middlewares/auth.middleware');
  return {
    ...originalModule,
    verifySession: (req, res, next) => {
      // Simulate that an admin session is active
      req.user = { id: 1, role: 'admin', email: 'admin@example.com' };
      req.session = { userId: 1, role: 'admin', email: 'admin@example.com' }; 
      next();
    },
    verifyAdmin: (req, res, next) => {
        // Build the req.user object as expected by verifyAdmin
        req.user = { id: 1, role: 'admin', email: 'admin@example.com', firstName:'Admin', lastName:'Test' };
        req.session = { userId: 1, role: 'admin', email: 'admin@example.com', firstName:'Admin', lastName:'Test' };
        next();
    }
  };
});

// Mock image upload to avoid real calls to AWS/S3/DO Spaces
jest.mock('../middlewares/blogArticleImageUpload', () => ({
  single: () => (req, res, next) => {
    // Simulate that multer processed the file correctly
    req.file = {
      location: 'https://fake-url.com/image.jpg',
      originalname: 'test.jpg'
    };
    next();
  }
}));

const request = require('supertest');
const app = require('../index');
const { sequelize, BlogArticle } = require('../models');

describe('BlogArticle API (Session Auth)', () => {
  let articleId;

  beforeAll(async () => {
    // No explicit cleanup to preserve seeded data
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // 1. CREATE (POST)
  test('POST /api/blogArticles - Should create an article (Session Auth)', async () => {
    const res = await request(app)
      .post('/api/blogArticles')
      .field('title', 'New Accessibility Article')
      .field('description', 'Short description')
      .field('content', 'Full article content...')
      .field('dateCreation', '2025-01-01')
      // Even though the mock ignores it, we send an attachment to simulate multipart form-data
      .attach('image', Buffer.from('fake image'), 'test.jpg');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('New Accessibility Article');
    articleId = res.body.id;
  });

  // 2. READ (GET)
  test('GET /api/blogArticles - Should retrieve the list of articles', async () => {
    const res = await request(app).get('/api/blogArticles');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBe('New Accessibility Article');
  });

  // 3. UPDATE (PUT)
  test('PUT /api/blogArticles/:id - Should update an article', async () => {
    const res = await request(app)
      .put(`/api/blogArticles/${articleId}`)
      .field('title', 'Updated Article')
      .field('description', 'New description')
      .field('content', 'New content')
      .field('dateCreation', '2025-01-02')
      .attach('image', Buffer.from('fake image 2'), 'updated.jpg');

    expect(res.statusCode).toEqual(200);
    
    // Verify changes in DB
    const updated = await BlogArticle.findByPk(articleId);
    expect(updated.title).toBe('Updated Article');
  });

  // 4. DELETE (DELETE)
  test('DELETE /api/blogArticles/:id - Should delete an article', async () => {
    const res = await request(app)
      .delete(`/api/blogArticles/${articleId}`);

    expect(res.statusCode).toEqual(200);
    
    const check = await BlogArticle.findByPk(articleId);
    expect(check).toBeNull();
  });

  // 5. ERROR HANDLING (Validation)
  test('POST /api/blogArticles - Should fail validation if title is missing', async () => {
    const res = await request(app)
      .post('/api/blogArticles')
      // Missing title field
      .field('description', 'Missing Title Test')
      .attach('image', Buffer.from('fake'), 'test.jpg');

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('title'); // Checks that error mentions 'title'
  });

  // 6. DASHBOARD QUERY (Specific Dashboard Route)
  // This satisfies the "consulta del dashboard" requirement
  test('GET /dashboard-admin/blog-articles - Should access dashboard view', async () => {
    const res = await request(app).get('/dashboard-admin/blog-articles');

    expect(res.statusCode).toEqual(200);
    // As it renders a view, content-type should be html
    expect(res.headers['content-type']).toMatch(/html/);
  });
});
