const ldap = require('ldapjs');
const crypto = require('crypto');

class LDAPService {
  constructor() {
    this.baseDN = process.env.LDAP_BASE_DN || 'dc=canaccesible,dc=es';
    this.adminDN = process.env.LDAP_ADMIN_DN || 'cn=admin,dc=canaccesible,dc=es';
    this.adminPassword = process.env.LDAP_ADMIN_PASSWORD || 'admin';
    this.ldapUrl = process.env.LDAP_URL || 'ldap://localhost:389';
    // Organizational Units mapped by role
    this.ouMap = {
      usuario: `ou=users,${this.baseDN}`,
      admin: `ou=admins,${this.baseDN}`,
      municipio: `ou=towns,${this.baseDN}`,
    };
    this.groupOu = `ou=groups,${this.baseDN}`;
    // Group DNs mapped by role
    this.groupMap = {
      usuario: `cn=usuario,${this.groupOu}`,
      admin: `cn=admin,${this.groupOu}`,
      municipio: `cn=municipio,${this.groupOu}`,
    };
  }

  // Get OU based on role
  getOUByRole(role = 'usuario') {
    return this.ouMap[role] || this.ouMap['usuario'];
  }

  // Get Group DN based on role
  getGroupDNByRole(role = 'usuario') {
    return this.groupMap[role] || this.groupMap['usuario'];
  }

  async createConnection() {
    return new Promise((resolve, reject) => {
      const client = ldap.createClient({
        url: this.ldapUrl,
        timeout: 5000,
      });

      client.on('error', (err) => {
        console.error('LDAP Connection Error:', err);
        reject(err);
      });

      client.on('connect', () => {
        console.log('[LDAP] Connected to server');
        resolve(client);
      });
    });
  }

  async bind(client, bindDN, password) {
    return new Promise((resolve, reject) => {
      client.bind(bindDN, password, (err) => {
        if (err) {
          console.error(`[LDAP] Bind failed for ${bindDN}:`, err.message);
          reject(err);
        } else {
          console.log(`[LDAP] Bind successful: ${bindDN}`);
          resolve();
        }
      });
    });
  }

  async search(client, searchBase, options) {
    return new Promise((resolve, reject) => {
      const entries = [];
      
      client.search(searchBase, options, (err, res) => {
        if (err) {
          console.error('[LDAP] Search error:', err);
          reject(err);
          return;
        }

        res.on('searchEntry', (entry) => {
          entries.push(entry.pojo);
        });

        res.on('searchReference', (referral) => {
          console.log('[LDAP] Referral:', referral.uris);
        });

        res.on('error', (err) => {
          console.error('[LDAP] Search stream error:', err);
          reject(err);
        });

        res.on('end', (result) => {
          if (result.status !== 0) {
            reject(new Error(`LDAP search error: ${result.status}`));
          } else {
            resolve(entries);
          }
        });
      });
    });
  }

  async add(client, dn, attributes) {
    return new Promise((resolve, reject) => {
      client.add(dn, attributes, (err) => {
        if (err) {
          console.error(`[LDAP] Add failed for ${dn}:`, err.message);
          reject(err);
        } else {
          console.log(`[LDAP] Entry added: ${dn}`);
          resolve();
        }
      });
    });
  }

  async modify(client, dn, changes) {
    return new Promise((resolve, reject) => {
      client.modify(dn, changes, (err) => {
        if (err) {
          console.error(`[LDAP] Modify failed for ${dn}:`, err.message);
          reject(err);
        } else {
          console.log(`[LDAP] Entry modified: ${dn}`);
          resolve();
        }
      });
    });
  }

  async close(client) {
    return new Promise((resolve) => {
      client.unbind(() => {
        console.log('[LDAP] Connection closed');
        resolve();
      });
    });
  }

  encryptSSHA(password) {
    const salt = crypto.randomBytes(4);
    const sha = crypto.createHash('sha1');
    sha.update(password);
    sha.update(salt);
    const hash = sha.digest();
    const ssha = Buffer.concat([hash, salt]);
    return '{SSHA}' + ssha.toString('base64');
  }

  async addUserToGroup(client, userUid, role) {
    return new Promise((resolve, reject) => {
      const groupDN = this.getGroupDNByRole(role);
      
      const change = new ldap.Change({
        operation: 'add',
        modification: {
          memberUid: userUid
        }
      });

      client.modify(groupDN, change, (err) => {
        if (err) {
          // Ignore if user is already in group (type 68: entryAlreadyExists)
          if (err.code === 68) {
            console.log(`[LDAP] User already in group: ${groupDN}`);
            resolve();
          } else {
            console.error(`[LDAP] Add to group failed: ${groupDN}`, err.message);
            reject(err);
          }
        } else {
          console.log(`[LDAP] User added to group: ${groupDN}`);
          resolve();
        }
      });
    });
  }

  async createUser(userData) {
    let client;
    try {
      client = await this.createConnection();
      await this.bind(client, this.adminDN, this.adminPassword);

      const { uid, firstName, lastName, email, password, telephone, role } = userData;
      // Get OU based on user role
      const userOu = this.getOUByRole(role);
      const userDN = `uid=${uid},${userOu}`;
      const sshaPassword = this.encryptSSHA(password);
      const displayName = `${firstName} ${lastName}`;

      const attributes = {
        objectClass: ['inetOrgPerson', 'organizationalPerson', 'person', 'top'],
        uid: uid,
        cn: displayName,
        displayName: displayName,
        sn: lastName,
        givenName: firstName,
        mail: email,
        userPassword: sshaPassword,
        ...(telephone && { telephoneNumber: telephone }),
      };

      await this.add(client, userDN, attributes);
      
      // Add user to corresponding group
      await this.addUserToGroup(client, uid, role);
      
      return {
        success: true,
        message: `User created in LDAP: ${userDN}`,
        userDN,
      };
    } catch (error) {
      console.error('[LDAP] Create user error:', error.message);
      throw error;
    } finally {
      if (client) await this.close(client);
    }
  }

  async forwardLookup(searchValue) {
    let client;
    try {
      client = await this.createConnection();
      await this.bind(client, this.adminDN, this.adminPassword);

      const filter = `(|(uid=${searchValue})(mail=${searchValue}))`;
      console.log(`[LDAP] Forward lookup for: ${searchValue}`);
      
      // Search in all role-based OUs and user OU
      for (const role of Object.keys(this.ouMap)) {
        const userOu = this.getOUByRole(role);
        const entries = await this.search(client, userOu, {
          filter,
          scope: 'sub',
          attributes: ['uid', 'cn', 'mail', 'givenName', 'sn', 'telephoneNumber', 'displayName'],
        });

        if (entries.length > 0) {
          const user = entries[0];
          console.log(`[LDAP] User found: ${user.dn}`);

          return {
            dn: user.dn,
            uid: user.uid,
            cn: user.cn,
            displayName: user.displayName,
            mail: user.mail,
            givenName: user.givenName,
            sn: user.sn,
            telephoneNumber: user.telephoneNumber,
          };
        }
      }

      console.log('[LDAP] User not found');
      return null;
    } catch (error) {
      console.error('[LDAP] Forward lookup error:', error.message);
      throw error;
    } finally {
      if (client) await this.close(client);
    }
  }

  async authenticate(userDN, password) {
    let client;
    try {
      console.log(`[LDAP] Authenticating: ${userDN}`);
      client = await this.createConnection();
      await this.bind(client, userDN, password);
      console.log('[LDAP] Authentication successful');
      
      return {
        success: true,
        message: 'Authentication successful',
        userDN,
      };
    } catch (error) {
      console.log('[LDAP] Authentication failed:', error.message);
      return {
        success: false,
        message: 'Invalid password or user not found',
        error: error.message,
      };
    } finally {
      if (client) await this.close(client);
    }
  }

  async authenticateByEmail(searchValue, password) {
    try {
      const user = await this.forwardLookup(searchValue);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }
      return await this.authenticate(user.dn, password);
    } catch (error) {
      console.error('[LDAP] Auth by email error:', error.message);
      throw error;
    }
  }

}

module.exports = new LDAPService();
