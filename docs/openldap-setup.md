# OpenLDAP Setup

This document details the technical implementation of the OpenLDAP server for centralized user management, authentication, and groups in **CanAccesible** project.

---

## LDAP Concepts

### LDAP (Lightweight Directory Access Protocol)

It is an open, standard protocol for accessing and maintaining distributed directory information services over an IP network. In CanAccesible, it acts as the single source of truth for user authentication and centralizing user management.

### Distinguished Name (DN)

A DN is a unique identifier for each entry in the LDAP directory, similar to a full path in a file system. It consists of a sequence of Relative Distinguished Names (RDNs) separated by commas, read from right to left. For example: `uid=carlos,ou=users,dc=canaccesible,dc=es`.

In CanAccesible, DNs are used to uniquely identify users and perform authentication operations.

### Organizational Units (OU)

OUs are containers used to organize directory entries logically. They help structure the directory tree, similar to folders in a file system. In CanAccesible, we use OUs like `ou=users`, `ou=admins`, `ou=towns`, and `ou=groups` to categorize different types of entries.

### LDAP Filters

Filters are expressions used to search for entries in the directory. They use a specific syntax with operators like `=`, `&` (AND), `|` (OR), and `!` (NOT). For example:
- `(uid=carlos)`: Find entries where uid equals "carlos"
- `(|(uid=carlos)(mail=user@example.com))`: Find entries where uid is "carlos" OR mail is "user@example.com"

In CanAccesible, filters are used in search operations to locate users by email or UID.

### Forward vs Reverse Lookup

*   **Forward Lookup**: This is the standard process where we search for an entry (like a user) based on their known attributes. For example, searching for the entry where `uid=carlos` to obtain their DN or email. In CanAccesible, this is used during login to find user details by email or username.

    ```javascript
    async forwardLookup(searchValue) {
      // ... connection setup ...
      const filter = `(|(uid=${searchValue})(mail=${searchValue}))`;
      
      // Search in user OUs
      for (const role of Object.keys(this.organizationalUnitMap)) {
        const userOrganizationalUnit = this.getOrganizationalUnitByRole(role);
        const entries = await this.search(client, userOrganizationalUnit, {
          filter,
          scope: 'sub',
          attributes: ['uid', 'cn', 'mail', 'givenName', 'sn', 'telephoneNumber', 'displayName'],
        });

        if (entries.length > 0) {
          return {
            dn: entries[0].dn,
            uid: entries[0].uid,
            cn: entries[0].cn,
            // ... other attributes
          };
        }
      }
      return null;
    }
    ```

*   **Reverse Lookup**: Involves searching for the name or identifier of an entry based on a unique associated value, such as an IP address in DNS. In the context of identities, it can refer to finding the username associated with a specific numeric UID (`uidNumber`). In CanAccesible, this method is defined but currently not used in the authentication flow; user roles are retrieved from the MySQL database instead.

    ```javascript
    async reverseLookup(userIdentifier) {
      // ... connection setup ...
      let uid;
      if (userIdentifier.includes('=')) {
        // Extract uid from DN
        const dnParts = userIdentifier.split(',');
        const uidPart = dnParts.find(part => part.startsWith('uid='));
        uid = uidPart.split('=')[1];
      } else {
        uid = userIdentifier;
      }

      // Search groups where user is member
      const groups = await this.search(client, this.groupsOrganizationalUnit, {
        scope: 'one',
        filter: '(objectClass=groupOfNames)',
        attributes: ['cn', 'memberUid'],
      });

      const userGroups = [];
      for (const group of groups) {
        if (group.memberUid && group.memberUid.includes(uid)) {
          userGroups.push(group.cn);
        }
      }

      return {
        success: true,
        groups: userGroups,
      };
    }
    ```

### Authentication (Bind)

The credential validation process in LDAP is called "Bind". In CanAccesible, the backend first performs a Forward Lookup to retrieve the user's DN based on their email, then sends the DN and password to the LDAP server for verification. This is the core authentication mechanism used during login.

```javascript
async authenticateByEmail(searchValue, password) {
  const user = await this.forwardLookup(searchValue);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  return await this.authenticate(user.dn, password);
}
```

```javascript
async authenticate(userDN, password) {
  // ... connection setup ...
  console.log(`[LDAP] Authenticating: ${userDN}`);
  client = await this.createConnection();
  await this.bind(client, userDN, password);  // This is the bind operation
  console.log('[LDAP] Authentication successful');
  
  return {
    success: true,
    message: 'Authentication successful',
    userDN,
  };
}
```

```javascript
const ldapResult = await userService.authenticate(email, password);
if (!ldapResult) {
  return res.status(401).json({ message: 'Invalid credentials' });
// Proceed with successful authentication
```

## Docker Concepts

### Docker and Containers

Docker is a platform for developing, shipping, and running applications inside lightweight, portable containers. A container is a runnable instance of an image, which packages the application and its dependencies.

In CanAccesible, we use a Docker container for OpenLDAP to ensure consistent deployment across environments.

### Docker Compose

Docker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML file (`docker-compose.yml`) to configure the services, networks, and volumes.

Our setup uses Docker Compose to orchestrate the OpenLDAP container with its configuration.

### Volumes

Volumes are the preferred mechanism for persisting data generated by and used by Docker containers. In our LDAP setup, we use named volumes (`ldap_data` and `ldap_config`) to persist the database and configuration files.

### Networks

Docker networks enable communication between containers. We use a custom network (`canaccesible-network`) to isolate the LDAP service.

---

## Installation and Deployment with Docker

To deploy OpenLDAP using Docker, follow these steps:

1. **Ensure Docker and Docker Compose are installed** on your system. If not, install them from the official Docker website.

2. **Navigate to the project root directory** where the `docker-compose.yml` file is located.

3. **Review the `docker-compose.yml` file** to understand the configuration:
   - The service uses the `osixia/openldap:latest` image.
   - Environment variables set the organization, domain, and admin password.
   - Ports 389 (LDAP) and 636 (LDAPS) are exposed.
   - Volumes mount the initial data file and persist data.
   - The container is configured to restart unless stopped.

4. **Start the OpenLDAP container** in detached mode:
   ```bash
   docker-compose up -d openldap
   ```
   This command pulls the image if needed, creates the container, and starts it in the background.

5. **Verify the container is running**:
   ```bash
   docker ps | grep openldap
   ```
   You should see the `openldap` container listed as "Up".

6. **Check the logs** if needed:
   ```bash
   docker-compose logs openldap
   ```
   This helps troubleshoot any startup issues.

The OpenLDAP server is now running and ready to accept connections on localhost:389.

---

## 2. Data Structure (LDAP)

The directory structure is defined in the `ldap/data.ldif` file. This file uses the **LDIF** (LDAP Data Interchange Format) to describe directory entries.

### Organizational Units (OUs)

We have segmented the directory into logical Organizational Units to better organize resources:

```ldif
# Organizational Units
dn: ou=users,dc=canaccesible,dc=es
objectClass: organizationalUnit
ou: users

dn: ou=admins,dc=canaccesible,dc=es
objectClass: organizationalUnit
ou: admins

dn: ou=towns,dc=canaccesible,dc=es
objectClass: organizationalUnit
ou: towns

dn: ou=groups,dc=canaccesible,dc=es
objectClass: organizationalUnit
ou: groups
```

*   **ou=users**: Standard platform users.
*   **ou=admins**: System administrators.
*   **ou=towns**: Municipality representatives.
*   **ou=groups**: Security groups and roles.

### Groups and Roles

We define POSIX groups to manage permissions and roles within the application:

```ldif
dn: cn=usuario,ou=groups,dc=canaccesible,dc=es
objectClass: posixGroup
cn: usuario
gidNumber: 1001

dn: cn=admin,ou=groups,dc=canaccesible,dc=es
objectClass: posixGroup
cn: admin
gidNumber: 1002

dn: cn=municipio,ou=groups,dc=canaccesible,dc=es
objectClass: posixGroup
cn: municipio
gidNumber: 1003
```

### User Creation

Users are created by assigning them an appropriate `objectClass` (such as `inetOrgPerson` and `posixAccount`) and placing them in the corresponding OU.

**Code example to create a standard user:**

```ldif
dn: uid=carlos,ou=users,dc=canaccesible,dc=es
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: carlos
sn: Perez
givenName: Carlos
cn: Carlos Perez
displayName: Carlos Perez
uidNumber: 10001
gidNumber: 1001
userPassword: password123
gecos: Carlos Perez
loginShell: /bin/bash
homeDirectory: /home/carlos
```

**Code example to create an administrator:**

```ldif
dn: uid=adminUser,ou=admins,dc=canaccesible,dc=es
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: adminUser
sn: Admin
givenName: Super
cn: Super Admin
displayName: Super Admin
uidNumber: 10002
gidNumber: 1002
userPassword: adminPassword
gecos: Super Admin
loginShell: /bin/bash
homeDirectory: /home/adminUser
```

---

## 3. Verification Commands

To test the connection and search for users from the terminal (requires `ldap-utils` installed on the client or running it inside the container):

**Search for all users:**

```bash
ldapsearch -x -H ldap://localhost -b "dc=canaccesible,dc=es" -D "cn=admin,dc=canaccesible,dc=es" -w admin "(objectClass=inetOrgPerson)"
```

**Search for a specific user by UID:**

```bash
ldapsearch -x -H ldap://localhost -b "dc=canaccesible,dc=es" -D "cn=admin,dc=canaccesible,dc=es" -w admin "(uid=carlos)"
```

*   `-x`: Simple authentication.
*   `-H`: Server URI.
*   `-b`: Search base.
*   `-D`: User DN to bind (admin).
*   `-w`: Password.