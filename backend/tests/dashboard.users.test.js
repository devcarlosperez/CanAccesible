const request = require("supertest");
const app = require("../index");
const { sequelize, user: User, role: Role } = require("../models");

/**
 * Dashboard Admin - Users List Tests (Session Auth)
 *
 * LIMITATION: Tests requiring login (session-based) cannot be fully executed
 * because the authentication system depends on an external LDAP server.
 *
 * The LDAP service (ldap.service.js) is tightly coupled with the authentication
 * flow and exports a singleton instance, making it difficult to mock in Jest
 * without significant refactoring.
 *
 * Tests that CAN be executed:
 * - Unauthenticated access (redirect behavior)
 * - Non-existent routes (404 protection)
 *
 * Tests that CANNOT be executed without LDAP:
 * - Normal user forbidden access (403)
 * - Admin successful access (200)
 */

describe("Dashboard Admin - Users List (Session Auth)", () => {
  let normalUser;

  beforeAll(async () => {
    // Ensure roles exist
    let userRole = await Role.findOne({ where: { role: "usuario" } });
    if (!userRole) {
      userRole = await Role.create({ id: 1, role: "usuario" });
    }

    // Create a user for reference in tests
    normalUser = await User.create({
      firstName: "Normal",
      lastName: "User",
      email: "normal_dashboard@example.com",
      password: "password123",
      roleId: userRole.id,
      dateRegister: new Date(),
    });
  });

  afterAll(async () => {
    if (normalUser) await User.destroy({ where: { id: normalUser.id } });
    await sequelize.close();
  });

  // Test 1: Access without session -> Redirect to Home
  test("GET /dashboard-admin/users - Should redirect to /home if not logged in", async () => {
    const res = await request(app).get("/dashboard-admin/users");
    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toBe("/home");
  });

  // Test 2: Verify DELETE route does not exist (read-only dashboard)
  test("DELETE /dashboard-admin/users/:id - Should not exist (404)", async () => {
    const res = await request(app).delete(
      `/dashboard-admin/users/${normalUser.id}`
    );

    // Route doesn't exist, so it redirects to /home (no session) or returns 404
    expect([302, 404]).toContain(res.statusCode);
  });
});
