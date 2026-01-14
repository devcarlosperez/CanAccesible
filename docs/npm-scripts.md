# Script Reference (Commands)

This document lists the commands available to work on the project.

> **What is `cross-env`?**
> You will notice that many scripts internally use `cross-env`. It is simply a tool that ensures the project runs consistently on **Windows**, **Mac**, and **Linux**. It handles setting environment variables (like development or test modes) in a way that is compatible with all operating systems.

---

## Backend (`/backend`)

Run these commands inside the `backend` directory.

### Server Start

| Command | Function |
| :--- | :--- |
| `npm run dev` | Starts the server in **Development** mode. |
| `npm start` | Starts the server in **Production** mode (used for deployment). |

### Database (Development Mode)

Commands to manage your local database while coding.

| Command | Function |
| :--- | :--- |
| `npm run db:create:dev` | Creates an empty development database. |
| `npm run db:migrate:dev` | Applies pending changes (new tables) to the database. |
| `npm run db:seed:dev` | Populates the database with fake test data. |
| `npm run db:drop:dev` | **Deletes** the development database completely. |

### Tests

Commands to run automated tests.

| Command | Function |
| :--- | :--- |
| `npm test` | Runs all backend tests. |
| `npm run test:setup` | **Test Setup:** Starts Docker, creates test DB, and seeds data. Run this before starting tests. |
| `npm run test:teardown` | **Clean Up:** Stops Docker and drops the test database. Run this when finished. |

---

## Frontend (`/frontend`)

Run these commands inside the `frontend` directory.

### Development and Build

| Command | Function |
| :--- | :--- |
| `npm run dev` | Starts the web in development mode (updates on save). |
| `npm run build` | Builds the final optimized version for production (`/dist`). |
| `npm run preview` | Locally previews the final build (`build`). |
| `npm run lint` | Checks code for style errors. |

### Tests

| Command | Function |
| :--- | :--- |
| `npm test` | Runs the frontend tests. |
| `npm run coverage` | Runs tests and shows a code coverage report. |