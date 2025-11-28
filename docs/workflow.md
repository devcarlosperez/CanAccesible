# Team Workflow & Contribution Guide

This document outlines the development workflow, version control strategy, and collaboration standards used by the **CanAccesible** team. Our goal is to maintain a clean history, ensure code quality, and facilitate collaboration among the 3 team members.

---

## Methodology

We follow an **Agile/Scrum** methodology, organizing our work in **Sprints**.
- **Task Management**: We use **GitHub Projects** to manage the backlog, track active tasks, and monitor progress.
- **Sprints**: Each sprint focuses on a specific set of features or improvements to be delivered by the end of the cycle.

---

## Branching Strategy

We use a simplified **Gitflow** workflow to manage our repository.

### Main Branches

- **`main`**: This branch contains the production-ready code. It reflects the stable version of the project delivered at the end of each Sprint.
- **`develop`**: The main integration branch. All new features and fixes are merged here first. It represents the latest development state.

### Temporary Branches

- **`feature/<task-name>`**: Created from `develop`. Used for developing specific features or tasks (e.g., `feature/login-page`, `feature/map-component`).

---

## Development Workflow

### 1. Task Assignment

Before starting code, we select a task from the **GitHub Project** board and move it to "In Progress".

### 2. Branch Creation

We create a new local branch for the task, from the branch `develop`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

### 3. Development & Commits

We work on the feature locally. We strive for **atomic and descriptive commits** to make the history readable.

```bash
git add .
git commit -m "feat: add login form validation"
```

### 4. Push & Pull Request (PR)

Once the task is complete, we push the branch to the remote repository (GitHub).

```bash
git push origin feature/my-new-feature
```

Then, we open a **Pull Request (PR)** on GitHub targeting the **`develop`** branch.

### 5. Merge

After approval, the PR is merged into `develop`. The feature branch is then deleted.

### 6. Release (End of Sprint)

When a Sprint is completed and `develop` is stable, we merge `develop` into **`main`** to mark a new version of the application.

---

## Environment Configuration

To ensure consistency between development and production environments, we manage configuration variables using `.env` files in the **backend**.

- **`.env.development`**: Contains configuration for the local development environment. The database credentials in this file are used for testing and development purposes. This file is used when running `npm run dev`.
- **`.env.production`**: Contains configuration for the production environment. This is used for the live web application (production). This file is used when running the app in production mode.

> **Important:** These files are **not** committed to the repository for security reasons. A `.env.example` file is provided as a template.

---

## Production Deployment

All team members have access to the **Digital Ocean** team account, where the production infrastructure is hosted. This includes the Droplet (server), Space Storage (image CDN), and MySQL database. Team members can access and manage these resources for deployment and monitoring purposes.

## Code Standards

- **Language**: English is preferred for code comments and commit messages.
- **Formatting**: We use **Prettier** and **ESLint** to ensure consistent code style across the project.
- **Editor Configuration**: We use an **`.editorconfig`** file to maintain consistent coding styles (indentation, charset, etc.) between different editors and IDEs used by the team.