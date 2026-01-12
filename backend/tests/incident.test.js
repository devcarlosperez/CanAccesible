// Mock authentication
jest.mock('../middlewares/auth.middleware', () => {
  const originalModule = jest.requireActual('../middlewares/auth.middleware');
  const mockSession = { 
    userId: 1, 
    id: 1, // Add this for consistency if controllers access .id
    role: 'admin',  
    email: 'admin@example.com', 
    firstName: 'Admin', 
    lastName: 'Test',
    cookie: {
      originalMaxAge: 3600000,
      secure: false,
      httpOnly: true,
      path: '/'
    },
    save: (cb) => { if(cb) cb(); },
    destroy: (cb) => { if(cb) cb(); },
    touch: () => {}
  };

  return {
    ...originalModule,
    verifySession: (req, res, next) => {
      req.user = { ...mockSession };
      req.session = mockSession; 
      next();
    },
    verifyTokenOrSession: (req, res, next) => {
      req.user = { ...mockSession };
      req.session = mockSession; 
      next();
    },
    verifyAdmin: (req, res, next) => {
        req.user = { ...mockSession };
        req.session = mockSession;
        next();
    }
  };
});

// Mock image upload
jest.mock('../middlewares/incidentImageUpload', () => {
  const multer = require('multer');
  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  return {
    single: (fieldName) => (req, res, next) => {
       upload.single(fieldName)(req, res, (err) => {
           if (err) return next(err);
           // Manually add location for the controller
           if (req.file) {
             req.file.location = 'https://fake-url.com/incident-image.jpg';
           }
           next();
       });
    }
  };
});

const request = require('supertest');
const app = require('../index');
const { sequelize, Incident } = require('../models');

describe('Incident API (Session Auth)', () => {
  let incidentId;

  afterAll(async () => {
    await sequelize.close();
  });

  // 1. Create (POST)
  test('POST /api/incidents - Should create an incident', async () => {
    const res = await request(app)
      .post('/api/incidents')
      .field('name', 'Test Incident')
      .field('description', 'This is a test incident description')
      .field('incidentStatusId', 1)
      .field('incidentTypeId', 1)
      .field('incidentSeverityId', 1)
      .field('area', 'movilidad')
      .field('latitude', 28.5)
      .field('longitude', -15.5)
      .field('island', 'Gran Canaria')
      .field('dateIncident', '2026-01-12')
      .attach('image', Buffer.from('fake image'), 'test.jpg');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Incident');
    incidentId = res.body.id;
  });

  // 2. Read (GET)
  test('GET /api/incidents - Should retrieve the list of incidents', async () => {
    const res = await request(app).get('/api/incidents');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    
    const created = res.body.find(i => i.id === incidentId);
    expect(created).toBeDefined();
    expect(created.name).toBe('Test Incident');
  });

  // 3. Update (PUT)
  test('PUT /api/incidents/:id - Should update an incident', async () => {
    const res = await request(app)
      .put(`/api/incidents/${incidentId}`)
      .field('name', 'Updated Incident Name')
      .field('description', 'Updated description')
      .field('incidentStatusId', 2)
      .field('area', 'arquitectura')
      .attach('image', Buffer.from('fake image 2'), 'updated.jpg');

    expect(res.statusCode).toEqual(200);
    
    const resGet = await request(app).get(`/api/incidents/${incidentId}`);
    expect(resGet.body.name).toBe('Updated Incident Name');
    expect(resGet.body.incidentStatusId).toBe(2);
  });

  // 4. Delete (DELETE)
  test('DELETE /api/incidents/:id - Should delete an incident', async () => {
    const res = await request(app)
      .delete(`/api/incidents/${incidentId}`);

    expect(res.statusCode).toEqual(200);
    
    const resGet = await request(app).get(`/api/incidents/${incidentId}`);
    expect(resGet.statusCode).toEqual(404);
  });

  // 5. Validation
  test('POST /api/incidents - Should fail validation if name is missing', async () => {
    const res = await request(app)
      .post('/api/incidents')
      .field('description', 'Missing Name Test')
      .field('incidentStatusId', 1)
      .field('incidentTypeId', 1);
    expect(res.statusCode).not.toEqual(201); 
  });

  // 6. Dashboard query
  test('GET /dashboard-admin/incidents - Should access dashboard view', async () => {
    const res = await request(app).get('/dashboard-admin/incidents');

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});
