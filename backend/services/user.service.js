const db = require('../models');
const ldapService = require('./ldap.service');
const bcrypt = require('bcrypt');

const User = db.user;

class UserService {
  async registerUser(userData) {
    try {
      const { firstName, lastName, email, password, roleId, telephone, nameFile } = userData;
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Get the role to determine LDAP OU
      const role = await db.role.findByPk(roleId || 1);
      const roleName = role ? role.role : 'usuario';

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        roleId: roleId || 1,
        dateRegister: new Date(),
        nameFile: nameFile || null,
      });

      console.log(`[USER] User created in DB: ID ${newUser.id}`);

      // Create in LDAP with role-based OU
      const ldapResult = await ldapService.createUser({
        uid: email,
        firstName,
        lastName,
        email,
        password,
        telephone,
        role: roleName,
      });

      return {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        roleId: newUser.roleId,
        role: roleName,
        ldapDN: ldapResult.userDN,
        message: 'User registered successfully',
      };
    } catch (error) {
      console.error('[USER] Register error:', error.message);
      throw error;
    }
  }

  async authenticate(email, password) {
    try {
      const user = await User.findOne({
        where: { email },
        include: [{ model: db.role, as: 'role' }],
      });

      if (!user) {
        throw new Error('User not found');
      }

      const ldapResult = await ldapService.authenticateByEmail(email, password);
      
      if (!ldapResult.success) {
        throw new Error(ldapResult.message);
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
        role: user.role?.role,
        ldapDN: ldapResult.userDN,
        message: 'Authentication successful',
      };
    } catch (error) {
      console.error('[USER] Auth error:', error.message);
      throw error;
    }
  }
}

module.exports = new UserService();
