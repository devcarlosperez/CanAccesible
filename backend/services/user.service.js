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

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email },
        include: [{ model: db.role, as: 'role' }],
      });

      if (!user) {
        return null;
      }

      const ldapUser = await ldapService.forwardLookup(email);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
        role: user.role?.role,
        dateRegister: user.dateRegister,
        ldapDN: ldapUser?.dn,
        ldapAttributes: ldapUser,
      };
    } catch (error) {
      console.error('[USER] Get by email error:', error.message);
      throw error;
    }
  }

  async getUserGroups(email) {
    try {
      const ldapUser = await ldapService.forwardLookup(email);
      
      if (!ldapUser) {
        throw new Error('User not found in LDAP');
      }

      return await ldapService.reverseLookup(ldapUser.dn);
    } catch (error) {
      console.error('[USER] Get groups error:', error.message);
      throw error;
    }
  }

  async updatePassword(email, oldPassword, newPassword) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const ldapUser = await ldapService.forwardLookup(email);
      await ldapService.updateUserPassword(ldapUser.dn, newPassword);
      console.log('[USER] Password updated in LDAP');

      return {
        success: true,
        message: 'Password updated',
      };
    } catch (error) {
      console.error('[USER] Update password error:', error.message);
      throw error;
    }
  }

  async syncFromLDAP(userDN) {
    try {
      const ldapUser = await ldapService.getUserByDN(userDN);
      
      if (!ldapUser) {
        throw new Error('User not found in LDAP');
      }

      const [user, created] = await User.findOrCreate({
        where: { email: ldapUser.mail },
        defaults: {
          firstName: ldapUser.givenName || 'User',
          lastName: ldapUser.sn || 'LDAP',
          email: ldapUser.mail,
          roleId: 1,
          dateRegister: new Date(),
        },
      });

      if (created) {
        console.log(`[USER] User synced (created): ${user.email}`);
      } else {
        await user.update({
          firstName: ldapUser.givenName || user.firstName,
          lastName: ldapUser.sn || user.lastName,
        });
        console.log(`[USER] User synced (updated): ${user.email}`);
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        ldapDN: userDN,
        synced: true,
      };
    } catch (error) {
      console.error('[USER] Sync from LDAP error:', error.message);
      throw error;
    }
  }

  async listAllUsers() {
    try {
      const dbUsers = await User.findAll({
        include: [{ model: db.role, as: 'role' }],
      });

      const ldapUsers = await ldapService.listAllUsers();

      return dbUsers.map((dbUser) => {
        const ldapUser = ldapUsers.find((lu) => lu.mail === dbUser.email);

        return {
          id: dbUser.id,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          email: dbUser.email,
          role: dbUser.role?.role,
          dateRegister: dbUser.dateRegister,
          ldapDN: ldapUser?.dn,
          inLDAP: !!ldapUser,
        };
      });
    } catch (error) {
      console.error('[USER] List users error:', error.message);
      throw error;
    }
  }
}

module.exports = new UserService();
