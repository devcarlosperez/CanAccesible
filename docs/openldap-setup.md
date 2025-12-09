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

### LDIF (LDAP Data Interchange Format)

LDIF is a standard text format for representing LDAP directory entries and changes. It is used to import and export data from LDAP directories. In CanAccesible, we use LDIF files to bootstrap initial data into the LDAP directory.

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

---

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

   ```yaml
   services:
     openldap:
       image: osixia/openldap:latest
       container_name: openldap
       restart: unless-stopped
       environment:
         LDAP_ORGANISATION: "CanAccesible"
         LDAP_DOMAIN: "canaccesible.es"
         LDAP_ADMIN_PASSWORD: "admin"
       ports:
         - "389:389"
         - "636:636"
       volumes:
         - ./ldap/data.ldif:/container/service/slapd/assets/config/bootstrap/ldif/custom/data.ldif
         - ldap_data:/var/lib/ldap
         - ldap_config:/etc/ldap/slapd.d
       command: --copy-service
       networks:
         - canaccesible-network
   ```

   **Explanation of the configuration:**
   - **Image**: Uses `osixia/openldap:latest`, a robust and popular LDAP server image.
   - **Environment**: Sets the organization (`CanAccesible`), domain (`canaccesible.es`), and admin password (`admin`).
   - **Ports**: Exposes LDAP on port 389 and LDAPS on port 636.
   - **Volumes**: 
     - `./ldap/data.ldif`: Mounts the initial directory data for bootstrap.
     - `ldap_data` and `ldap_config`: Named volumes for persistent storage of database and config.
   - **Command**: `--copy-service` ensures the bootstrap data is loaded.
   - **Networks**: Uses `canaccesible-network` for isolation.

4. **Start the OpenLDAP container** in detached mode:
   ```bash
   docker-compose up -d
   ```
   This command pulls the image if needed, creates the container, and starts it in the background.

5. **Verify the container is running**:
   ```bash
   docker ps
   ```
   You should see output similar to this:

   ![Docker PS Output](/docs/images/docker-ps.png)

6. **Check the logs** if needed:
   ```bash
   docker-compose logs openldap
   ```
   This helps troubleshoot any startup issues.
   
   The OpenLDAP server is now running.

---

## Data Structure (LDAP)

The directory structure is defined in the `/ldap/data.ldif` file. This file uses the **LDIF** (LDAP Data Interchange Format) to describe directory entries.

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

We define POSIX groups and roles in the application:

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

---

## Verification Commands

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