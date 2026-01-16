# Backend Testing (Jest + Supertest)

Complete testing documentation for the CanAccesible backend.

---

## Test Structure

The tests are organized key functional areas within the `tests/` directory:

- **Blog Articles:** `tests/blogArticle.test.js` - Tests CRUD operations and retrieval of blog content.
- **Conversation Messages:** `tests/conversationMessage.test.js` - Tests the messaging functionality and history.
- **Dashboard Users:** `tests/dashboard.users.test.js` - Tests user management features for the admin dashboard.
- **Incidents:** `tests/incident.test.js` - Tests the full lifecycle of accessibility incidents (reporting, updating, viewing).
- **Incident Comments:** `tests/incidentComment.test.js` - Tests interacting with incidents through comments.
- **Notifications:** `tests/notification.test.js` - Tests the alert and notification system.

---

## Requirements / Setup

The backend tests require a specific environment setup including a test database and a Docker container for OpenLDAP.

- **Node.js**: LTS recommended (v18+)
- **Docker**: Required for running the OpenLDAP test container.
- **Install dependencies**:

```bash
cd backend
npm install
```

---

## How to Run Tests

The backend includes scripts to automatically handle the setup and teardown of the test environment.

### 1. Setup Environment

Before running the tests, initialize the test environment (Docker, Database creation, migrations, and assertions):

```bash
npm run test:setup
```
*This command starts the OpenLDAP container, creates the test database, runs migrations, and seeds the database.*

### 2. Run Tests

Execute the Jest test suite:

```bash
npm test
```

### 3. Teardown Environment

After finishing the tests, clean up the environment:

```bash
npm run test:teardown
```
*This command stops the OpenLDAP container and drops the test database.*

---

## Test File Structure

```
backend/tests/
├── blogArticle.test.js          # Blog endpoints & logic
├── conversationMessage.test.js  # Chat messaging
├── dashboard.users.test.js      # User management
├── incident.test.js             # Incident CRUD & flows
├── incidentComment.test.js      # Commenting system
└── notification.test.js         # User notifications
```
