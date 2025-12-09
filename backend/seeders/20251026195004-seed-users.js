"use strict";

const ldapService = require("../services/ldap.service");

// Helper to create user in LDAP during seeding
async function seedLDAPUser(user, password, roleName) {
  try {
    await ldapService.createUser({
      uid: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: password,
      role: roleName,
    });
    console.log(`[SEED] LDAP User created: ${user.email}`);
  } catch (error) {
    // Ignore if already exists
    if (error.code === 68) {
      console.log(`[SEED] LDAP User already exists: ${user.email}`);
    } else {
      console.error(`[SEED] LDAP Error for ${user.email}:`, error.message);
    }
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        firstName: "Carlos",
        lastName: "Pérez Santana",
        email: "carlos@gmail.com",
        dateRegister: new Date(),
        roleId: 1,
        roleName: "usuario",
        password: "carlos2004",
        nameFile: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Admin",
        lastName: "",
        email: "admin@gmail.com",
        dateRegister: new Date(),
        roleId: 2,
        roleName: "admin",
        password: "cji_canaccesible",
        nameFile:
          "https://images-cruds.fra1.digitaloceanspaces.com/user-image/Memes_de_admin.webp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Jonathan",
        lastName: "Morera",
        email: "jonathan.admin@gmail.com",
        dateRegister: new Date(),
        roleId: 2,
        roleName: "admin",
        password: "admin1",
        nameFile:
          "https://images-cruds.fra1.digitaloceanspaces.com/user-image/a39be34016f637c8cb1f1ab0acc735f4.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Iriome",
        lastName: "Jered",
        email: "iriome.admin@gmail.com",
        dateRegister: new Date(),
        roleId: 2,
        roleName: "admin",
        password: "admin2",
        nameFile:
          "https://images-cruds.fra1.digitaloceanspaces.com/user-image/57087.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Carlos",
        lastName: "Luis",
        email: "carlos.admin@gmail.com",
        dateRegister: new Date(),
        roleId: 2,
        roleName: "admin",
        password: "admin3",
        nameFile:
          "https://images-cruds.fra1.digitaloceanspaces.com/user-image/raf,360x360,075,t,fafafa_ca443f4786.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Profesor",
        lastName: "Querido",
        email: "prueba.admin@gmail.com",
        dateRegister: new Date(),
        roleId: 2,
        roleName: "admin",
        password: "prueba123",
        nameFile:
          "https://images-cruds.fra1.digitaloceanspaces.com/user-image/centro_ies-el-rincon.webp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Municipio",
        lastName: "Santa Cruz de Tenerife",
        email: "municipio@santacruz.es",
        dateRegister: new Date(),
        roleId: 3,
        roleName: "municipio",
        password: "municipio_2025",
        nameFile:
          "https://images-cruds.fra1.digitaloceanspaces.com/user-image/municipio_tenerife.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insert into DB
    const dbUsers = users.map(({ roleName, password, ...user }) => user);
    await queryInterface.bulkInsert("Users", dbUsers, {});

    // Insert into LDAP
    // Note: This might slow down seeding significantly
    if (process.env.NODE_ENV !== "test") {
      for (const user of users) {
        await seedLDAPUser(user, user.password, user.roleName);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
