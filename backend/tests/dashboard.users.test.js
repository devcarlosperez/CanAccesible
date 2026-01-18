const request = require("supertest");
const {
  sequelize,
  user: User,
  role: Role,
  incident: Incident,
  incidentStatus: IncidentStatus,
  incidentType: IncidentType,
  incidentSeverity: IncidentSeverity,
} = require("../models");

// 1. Mock doSpacesClient to avoid S3 connection errors
jest.mock("../config/doSpacesClient", () => ({
  s3: {},
  deleteImageFromStorage: jest.fn().mockResolvedValue(true),
}));

// 2. Mock log.service to avoid database logging during tests
jest.mock("../services/log.service", () => ({
  createLog: jest.fn().mockResolvedValue(true),
}));

// 3. Mock userImageUpload to avoid actual file processing
jest.mock("../middlewares/userImageUpload", () => ({
  single: () => (req, res, next) => next(),
}));

// 4. Mock auth.middleware with dynamic user switching
let mockUser = { id: 1, roleId: 2, email: "admin@test.com" };

jest.mock("../middlewares/auth.middleware", () => {
  const originalModule = jest.requireActual("../middlewares/auth.middleware");
  return {
    ...originalModule,
    verifyTokenOrSession: (req, res, next) => {
      req.user = mockUser;
      next();
    },
    verifyAdmin: (req, res, next) => {
      req.user = mockUser;
      if (mockUser.roleId === 2) {
        next();
      } else {
        return res.status(403).json({
          message: "You don't have permission to access this resource",
        });
      }
    },
  };
});

const app = require("../index");

describe("Dashboard Users API (Session Auth)", () => {
  let adminUser;
  let normalUser;
  let municipalityUser;

  // Helpers to switch roles
  const asAdmin = () => {
    mockUser = { id: adminUser.id, roleId: 2, email: adminUser.email };
  };
  const asUser = () => {
    mockUser = { id: normalUser.id, roleId: 1, email: normalUser.email };
  };

  beforeAll(async () => {
    // Ensure roles exist
    await Role.findOrCreate({ where: { id: 1 }, defaults: { name: "user" } });
    await Role.findOrCreate({ where: { id: 2 }, defaults: { name: "admin" } });
    await Role.findOrCreate({
      where: { id: 3 },
      defaults: { name: "municipio" },
    });

    // Ensure dependent data for incidents exists
    await IncidentStatus.findOrCreate({
      where: { id: 1 },
      defaults: { name: "Open" },
    });
    await IncidentType.findOrCreate({
      where: { id: 1 },
      defaults: { name: "General" },
    });
    await IncidentSeverity.findOrCreate({
      where: { id: 1 },
      defaults: { name: "Low" },
    });

    // Clean up potential previous run
    await User.destroy({
      where: {
        email: [
          "admin.dash@test.com",
          "user.dash@test.com",
          "muni.dash@test.com",
        ],
      },
    });

    // Create test users
    adminUser = await User.create({
      firstName: "Admin",
      lastName: "Dash",
      email: "admin.dash@test.com",
      password: "password",
      roleId: 2, // Admin
      dateRegister: new Date(),
    });

    normalUser = await User.create({
      firstName: "User",
      lastName: "Dash",
      email: "user.dash@test.com",
      password: "password",
      roleId: 1, // User
      dateRegister: new Date(),
    });

    municipalityUser = await User.create({
      firstName: "Muni",
      lastName: "Dash",
      email: "muni.dash@test.com",
      password: "password",
      roleId: 3, // Municipio
      dateRegister: new Date(),
    });

    // Create an incident for the normal user to test top-reporting
    await Incident.create({
      name: "Test Incident",
      description: "Test Description",
      userId: normalUser.id,
      latitude: 28.0,
      longitude: -15.0,
      incidentStatusId: 1,
      incidentSeverityId: 1,
      incidentTypeId: 1,
      island: "Gran Canaria",
      area: "movilidad",
      nameFile: "http://example.com/image.jpg",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // 1. GET ALL USERS
  test("GET /api/users - Admin should access all users", async () => {
    asAdmin();
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const ids = res.body.map((u) => u.id);
    expect(ids).toContain(adminUser.id);
    expect(ids).toContain(normalUser.id);
    expect(ids).toContain(municipalityUser.id);
  });

  test("GET /api/users - Non-admin should be forbidden", async () => {
    asUser();
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(403);
  });

  // 2. GET NORMAL USERS
  test("GET /api/users/user - Admin should access only normal users", async () => {
    asAdmin();
    const res = await request(app).get("/api/users/user");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const roles = res.body.map((u) => u.roleId);
    expect(roles.every((r) => r === 1)).toBe(true);

    const ids = res.body.map((u) => u.id);
    expect(ids).toContain(normalUser.id);
    expect(ids).not.toContain(adminUser.id);
  });

  test("GET /api/users/user - Non-admin should be forbidden", async () => {
    asUser();
    const res = await request(app).get("/api/users/user");
    expect(res.statusCode).toBe(403);
  });

  // 3. GET ADMIN USERS
  test("GET /api/users/admin - Admin should access only admins", async () => {
    asAdmin();
    const res = await request(app).get("/api/users/admin");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const roles = res.body.map((u) => u.roleId);
    expect(roles.every((r) => r === 2)).toBe(true);

    const ids = res.body.map((u) => u.id);
    expect(ids).toContain(adminUser.id);
    expect(ids).not.toContain(normalUser.id);
  });

  test("GET /api/users/admin - Non-admin should be forbidden", async () => {
    asUser();
    const res = await request(app).get("/api/users/admin");
    expect(res.statusCode).toBe(403);
  });

  // 4. GET MUNICIPALITIES
  test("GET /api/users/municipalities - Admin should access only municipalities", async () => {
    asAdmin();
    const res = await request(app).get("/api/users/municipalities");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const roles = res.body.map((u) => u.roleId);
    expect(roles.every((r) => r === 3)).toBe(true);

    const ids = res.body.map((u) => u.id);
    expect(ids).toContain(municipalityUser.id);
  });

  test("GET /api/users/municipalities - Non-admin should be forbidden", async () => {
    asUser();
    const res = await request(app).get("/api/users/municipalities");
    expect(res.statusCode).toBe(403);
  });

  // 5. GET TOP REPORTING USERS
  test("GET /api/users/top-reporting - Admin should access top reporters", async () => {
    asAdmin();
    const res = await request(app).get("/api/users/top-reporting");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("incidenceCount");
    }

    const reporter = res.body.find((u) => u.id === normalUser.id);
    expect(reporter).toBeDefined();
    expect(Number(reporter.incidenceCount)).toBeGreaterThan(0);
  });

  test("GET /api/users/top-reporting - Non-admin should be forbidden", async () => {
    asUser();
    const res = await request(app).get("/api/users/top-reporting");
    expect(res.statusCode).toBe(403);
  });
});
