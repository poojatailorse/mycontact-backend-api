# MyContact Backend API

This is a small Express + MongoDB backend API for managing users and their contacts.

Features
- User registration and login (JWT access token)
- CRUD operations for contacts (each contact belongs to a user)
- Simple error handling middleware

## Table of contents
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Data models](#data-models)
- [Notes & Troubleshooting](#notes--troubleshooting)
- [Next steps](#next-steps)

## Prerequisites
- Node.js (v16+ recommended)
- A running MongoDB instance (local or Atlas)

## Install

1. Clone the repo or open the project folder.
2. Install dependencies:

```bash
npm install
```

## Environment variables

Create a `.env` file in the project root with at least the following variables:

```
CONNECTION_STRING=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=your_long_random_secret_here
PORT=5000
```

Notes:
- `CONNECTION_STRING` is used by Mongoose to connect to MongoDB.
- `ACCESS_TOKEN_SECRET` is used to sign JWT access tokens.
- `PORT` is optional (defaults to 5000).

Important: the project currently calls the database connection before loading `.env` in `server.js` (the code calls `connectDb()` before `dotenv.config()`). That means you should either set environment variables in your shell/OS or move `dotenv.config()` above the `connectDb()` call. Recommended quick fix in `server.js`:

```js
// Move this to the top (before connectDb)
const dotenv = require('dotenv');
dotenv.config();

// then connect
connectDb();
```

## Available scripts

- `npm start` — run `node server.js`
- `npm run dev` — run the server with `nodemon` (auto-restarts during development)
- `npm test` — placeholder (no tests configured yet)

## API Endpoints

Base URL: http://localhost:5000 (or `http://localhost:<PORT>`)

Authentication
- The API uses JWT access tokens. After logging in, include the token in the `Authorization` header on protected routes:

```
Authorization: Bearer <accessToken>
```

Users
- POST /api/users/register
  - Body: { "username": "string", "email": "string", "password": "string" }
  - Response: 201 created with user id and email on success

- POST /api/users/login
  - Body: { "email": "string", "password": "string" }
  - Response: 200 with { "accessToken": "..." } on success

- GET /api/users/current
  - Protected. Returns the current authenticated user payload from the token.

Contacts (all routes below are protected — require Authorization header)
- GET /api/contacts
  - Returns contacts owned by the authenticated user

- POST /api/contacts
  - Body: { "name": "string", "email": "string", "phone": "string" }
  - Creates a contact for the authenticated user

- GET /api/contacts/:id
  - Get a single contact by id (must belong to the user)

- PUT /api/contacts/:id
  - Update a contact (must belong to the user)

- DELETE /api/contacts/:id
  - Delete a contact (must belong to the user)

Example (register, login, get contacts) using curl:

```bash
# Register
curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d '{"username":"alice","email":"alice@example.com","password":"P@ssw0rd"}'

# Login (returns accessToken)
curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"P@ssw0rd"}'

# Use the returned token for protected requests:
curl -H "Authorization: Bearer <accessToken>" http://localhost:5000/api/contacts
```

Note for PowerShell users: if you use the built-in alias `curl`, it maps to `Invoke-WebRequest`; you can use the real curl executable or use `Invoke-RestMethod` instead.

## Data models

User
- username: string (required)
- email: string (required, unique)
- password: string (hashed)

Contact
- user_id: ObjectId (ref to User) (required)
- name: string (required)
- email: string (required)
- phone: string (required)

## Notes & Troubleshooting

- If you see `process.env.CONNECTION_STRING undefined` in the logs, check your `.env` or the order of `dotenv.config()` vs `connectDb()` (see the note above).
- Tokens expire in 15 minutes by default (this is set in `userController.loginUser`). Refresh tokens are not implemented.
- Error responses are formatted by the `middleware/errorHandler.js` file.

## Next steps / improvements

- Add input validation (e.g., with Joi or express-validator)
- Implement refresh tokens and longer-lived sessions
- Add tests and CI
- Add pagination, sorting, and filtering for contacts

---
If you want, I can also open a PR to reorder `dotenv.config()` in `server.js` so that `.env` values are available during DB connection — tell me if you'd like me to make that change.
