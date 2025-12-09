# OpenLDAP Setup and Deployment

This document details the technical implementation of the OpenLDAP server for centralized identity management in CanAccesible.

---

## Installation and Deployment with Docker

We use Docker and Docker Compose to deploy OpenLDAP in a containerized manner, ensuring portability and ease of management.

### `docker-compose.yml` File

The service is defined in the `docker-compose.yml` file at the root of the project:

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

**Configuration Explanation:**
*   **Image**: We use `osixia/openldap:latest`, a robust and popular image.
*   **Environment**: We configure the organization, the base domain (`dc=canaccesible,dc=es`), and the administrator password.
*   **Volumes**:
    *   `./ldap/data.ldif`: We mount our initial data file so it loads automatically when the container starts for the first time (bootstrap).
    *   `ldap_data` and `ldap_config`: Persistent volumes to avoid data loss when restarting the container.

### Deployment Commands

To start the LDAP server:

```bash
docker-compose up -d openldap
```

To verify it is running:

```bash
docker ps | grep openldap
```

---

## Data Structure (LDAP)

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

## Key Concepts

### LDAP (Lightweight Directory Access Protocol)
It is an open, standard protocol for accessing and maintaining distributed directory information services over an IP network. In CanAccesible, it acts as the single source of truth for user authentication.

### Forward vs Reverse Lookup
*   **Forward Lookup**: This is the standard process where we search for an entry (like a user) based on their known attributes. For example, searching for the entry where `uid=carlos` to obtain their DN or email.
*   **Reverse Lookup**: Involves searching for the name or identifier of an entry based on a unique associated value, such as an IP address in DNS. In the context of identities, it can refer to finding the username associated with a specific numeric UID (`uidNumber`).

### Authentication (Bind)
The credential validation process in LDAP is called "Bind".
1.  The client (Backend) sends the user's DN (Distinguished Name) and password.
2.  The server verifies if that DN exists and if the password matches.
3.  If correct, the session is established and identity is confirmed.

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