const request = require("supertest");
const app = require("../index");
const {
  sequelize,
  user: User,
  notification: Notification,
} = require("../models");
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config/jwt");

describe("Notification API", () => {
  let user;
  let userToken;
  let otherUser;
  let otherUserToken;
  let notificationId;

  // Runs before all tests
  beforeAll(async () => {
    // 1. Create main user
    user = await User.create({
      firstName: "Notif",
      lastName: "Tester",
      email: "notif_tester@example.com",
      password: "password123",
      roleId: 1,
      dateRegister: new Date(),
    });

    userToken = jwt.sign(
      { id: user.id, email: user.email, role: "usuario" },
      jwtConfig.secret
    );

    // 2. Create secondary user (to test privacy)
    otherUser = await User.create({
      firstName: "Other",
      lastName: "Person",
      email: "other_notif@example.com",
      password: "password123",
      roleId: 1,
      dateRegister: new Date(),
    });

    otherUserToken = jwt.sign(
      { id: otherUser.id, email: otherUser.email, role: "usuario" },
      jwtConfig.secret
    );
  });

  afterAll(async () => {
    // Cleanup
    if (user) {
      await Notification.destroy({ where: { userId: user.id } });
      await Notification.destroy({ where: { userId: otherUser.id } });
      await User.destroy({ where: { id: user.id } });
      await User.destroy({ where: { id: otherUser.id } });
    }
    await sequelize.close();
  });

  // --- TESTS ---

  test("GET /api/notifications - Should return empty list initially", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  test("POST /api/notifications - Should create a notification", async () => {
    const res = await request(app)
      .post("/api/notifications")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        // Since the controller usually takes userId from token if not provided,
        // or we can allow the system to send it.
        // Let's rely on the controller logic: "const userId = bodyUserId || req.user.id;"
        entity: "Incident",
        entityId: 101,
        message: "You have a new alert",
        dateNotification: new Date(),
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("You have a new alert");
    expect(res.body.userId).toBe(user.id);

    notificationId = res.body.id;
  });

  test("GET /api/notifications - Should list the new notification", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(notificationId);
  });

  test("GET /api/notifications - Should NOT see other user's notifications", async () => {
    // Other User tries to list notifications. Should get empty or their own (which is 0).
    // Specifically, they should NOT see 'notificationId' created for the first user.
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toEqual(200);
    // Ensure the notification from user 1 is NOT in this list
    const found = res.body.find((n) => n.id === notificationId);
    expect(found).toBeUndefined();
  });

  test("DELETE /api/notifications/:id - Should delete own notification", async () => {
    const res = await request(app)
      .delete(`/api/notifications/${notificationId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);

    // Verify it's gone
    const check = await Notification.findByPk(notificationId);
    expect(check).toBeNull();
  });

  test("DELETE /api/notifications/:id - Should NOT delete other user's notification", async () => {
    // First, let's create a notification for "user" that "otherUser" will try to delete
    const notif = await Notification.create({
      userId: user.id,
      entity: "Incident",
      entityId: 102,
      message: "Do not touch",
      dateNotification: new Date(),
    });

    const res = await request(app)
      .delete(`/api/notifications/${notif.id}`)
      .set("Authorization", `Bearer ${otherUserToken}`);
    // Let's assume 404 based on findAll/findOne logic looking for `where: { userId }`.
    expect([403, 404]).toContain(res.statusCode);

    await Notification.destroy({ where: { id: notif.id } });
  });
});
