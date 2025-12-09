const ldap = require('ldapjs');
const crypto = require('crypto');

class LDAPService {
  constructor() {
    this.baseDN = process.env.LDAP_BASE_DN;
    this.adminDN = process.env.LDAP_ADMIN_DN;
    this.adminPassword = process.env.LDAP_ADMIN_PASSWORD;
    this.ldapUrl = process.env.LDAP_URL;
    
    if (!this.baseDN || !this.adminDN || !this.adminPassword || !this.ldapUrl) {
      console.warn('[LDAP] Warning: LDAP environment variables are not fully defined.');
    }

    // Organizational Units mapped by role
    this.organizationalUnitMap = {
      usuario: `ou=users,${this.baseDN}`,
      admin: `ou=admins,${this.baseDN}`,
      municipio: `ou=towns,${this.baseDN}`,
    };
    this.groupsOrganizationalUnit = `ou=groups,${this.baseDN}`;
    // Group DNs mapped by role
    this.groupDNMap = {
      usuario: `cn=usuario,${this.groupsOrganizationalUnit}`,
      admin: `cn=admin,${this.groupsOrganizationalUnit}`,
      municipio: `cn=municipio,${this.groupsOrganizationalUnit}`,
    };
  }

  // Get OU based on role
  getOrganizationalUnitByRole(role = 'usuario') {
    return this.organizationalUnitMap[role] || this.organizationalUnitMap['usuario'];
  }

  // Get Group DN based on role
  getGroupDNByRole(role = 'usuario') {
    return this.groupDNMap[role] || this.groupDNMap['usuario'];
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
          // entry.object can be null/undefined in some ldapjs versions or configurations
          // entry.pojo is usually reliable for raw data
          const user = entry.pojo || {};
          // Ensure we have a valid object to attach properties to
          const resultUser = { ...user };
          
          // entry.objectName is the DN string
          if (entry.objectName) {
            resultUser.dn = entry.objectName.toString();
          } else if (entry.dn) {
             resultUser.dn = entry.dn.toString();
          }
          
          // Map attributes if they are inside an 'attributes' array (common in pojo)
          if (user.attributes) {
             user.attributes.forEach(attr => {
                 resultUser[attr.type] = attr.values && attr.values.length === 1 ? attr.values[0] : attr.values;
             });
          }

          entries.push(resultUser);
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
        modification: new ldap.Attribute({
          type: 'memberUid',
          values: [userUid]
        })
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
      const userOu = this.getOrganizationalUnitByRole(role);
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

      try {
        await this.add(client, userDN, attributes);
      } catch (err) {
        if (err.code === 68) {
          console.log(`[LDAP] User already exists, proceeding to group assignment: ${userDN}`);
        } else {
          throw err;
        }
      }
      
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
      for (const role of Object.keys(this.organizationalUnitMap)) {
        const userOrganizationalUnit = this.getOrganizationalUnitByRole(role);
        const entries = await this.search(client, userOrganizationalUnit, {
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
      return null;
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
      return {
        success: false,
        message: 'Authentication error: ' + error.message,
      };
    }
  }

  async reverseLookup(userIdentifier) {
    try {
      const client = await this.createConnection();
      await this.bind(client, this.adminDN, this.adminPassword);

      // Extract uid from DN if full DN provided, else assume it's uid
      let uid;
      if (userIdentifier.includes('=')) {
        // It's a DN, extract uid
        const dnParts = userIdentifier.split(',');
        const uidPart = dnParts.find(part => part.startsWith('uid='));
        if (!uidPart) {
          await this.close(client);
          return {
            success: false,
            message: 'Invalid DN format',
          };
        }
        uid = uidPart.split('=')[1];
      } else {
        uid = userIdentifier;
      }

      // Search all groups in ou=groups
      const searchOptions = {
        scope: 'one',
        filter: '(objectClass=groupOfNames)',
        attributes: ['cn', 'memberUid'],
      };

      const groups = await this.search(client, this.groupsOrganizationalUnit, searchOptions);
      const userGroups = [];

      for (const group of groups) {
        if (group.memberUid && Array.isArray(group.memberUid)) {
          if (group.memberUid.includes(uid)) {
            userGroups.push(group.cn);
          }
        } else if (group.memberUid === uid) {
          userGroups.push(group.cn);
        }
      }

      await this.close(client);
      return {
        success: true,
        groups: userGroups,
      };
    } catch (error) {
      console.error('[LDAP] Reverse lookup error:', error.message);
      return {
        success: false,
        message: 'Reverse lookup error: ' + error.message,
      };
    }
  }

}

module.exports = new LDAPService();