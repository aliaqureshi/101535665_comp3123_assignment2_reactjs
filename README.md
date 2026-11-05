# COMP3123 Assignment 2 — Employee Management System

**Student Name:** Alia Qureshi  
**Student ID:** 101535665  
**Course:** COMP3123 — Full Stack Development  
**Assignment:** Assignment 2 — Frontend Development  
**Repository:** 101535665_comp3123_assignment2_reactjs

---

## Project Overview

This project is a full-stack MERN Employee Management System developed for COMP3123 Assignment 2.

The application provides secure user authentication and employee management through a React frontend and a Node.js/Express REST API.

Authenticated users can create and manage their own employee records. Employee data is isolated by user ownership so that one authenticated user cannot access or modify another user's employees.

The application supports:

- User signup and login
- JWT authentication
- Protected frontend routes
- Employee creation
- Employee listing
- Employee details
- Employee updates
- Employee deletion
- Employee search by department and/or position
- Employee profile picture uploads
- Profile picture replacement
- Responsive React interface
- Docker Compose deployment
- MongoDB persistence
- Backend health monitoring

---

## Technology Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- express-validator
- Multer
- Helmet
- CORS
- Express Rate Limit

### Deployment / Development

- Docker
- Docker Compose
- Nginx
- Mongo Express
- Git
- GitHub
- Postman

---

## Project Structure

```text
101535665_comp3123_assignment2_reactjs/
├── docker-compose.yml
├── README.md
├── .gitignore
│
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── config/
│   ├── utils/
│   ├── uploads/
│   └── logs/
│
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── .env.example
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        ├── services/
        ├── App.jsx
        ├── main.jsx
        └── styles.css
```

---

# Application Features

## Authentication

The application supports secure account creation and login.

Passwords are hashed before being stored in MongoDB and are never stored as plain text.

After successful login, the backend returns a JWT. The React frontend stores the authentication session and automatically sends the token in the Authorization header for protected API requests.

Protected frontend routes redirect unauthenticated users to the login page.

Logging out removes the local authentication session and returns the user to the login page.

---

## Employee Management

Authenticated users can:

- View their employee records
- Add employees
- View individual employee details
- Edit employee information
- Delete employees
- Upload employee profile pictures
- Replace existing profile pictures
- Search employees

Each employee belongs to the authenticated user who created the record.

---

## Employee Search

Employee records can be searched by:

- Department
- Position
- Department and position together

Search functionality supports:

- Case-insensitive matching
- Partial matching
- User ownership filtering
- Empty result sets
- Input validation

Search requests are performed through the backend API rather than by filtering records only in the browser.

---

## Profile Picture Upload

Employee profile pictures are handled using multipart form data.

Supported image formats:

- JPEG
- PNG
- WebP

Maximum file size:

```text
2 MB
```

The application validates uploaded files on both the frontend and backend.

Uploaded files use generated unique filenames rather than trusting the original uploaded filename.

MongoDB stores only the profile picture path. Raw image data is not stored in the database.

When a profile picture is replaced, the previous local image is removed where applicable.

When an employee is deleted, the associated local profile picture is also removed where applicable.

---

# REST API

Base API path:

```text
/api/v1
```

## User Endpoints

### Create User

```http
POST /api/v1/user/signup
```

Creates a new user account.

Expected success status:

```text
201 Created
```

---

### Login

```http
POST /api/v1/user/login
```

Users may authenticate using their username/email and password.

Expected success status:

```text
200 OK
```

A successful login returns a JWT.

---

# Employee Endpoints

All employee endpoints require authentication.

The JWT must be supplied using:

```http
Authorization: Bearer <token>
```

### Get Employees

```http
GET /api/v1/emp/employees
```

Returns employees owned by the authenticated user.

Expected success status:

```text
200 OK
```

---

### Create Employee

```http
POST /api/v1/emp/employees
```

Creates a new employee.

Supports:

```text
multipart/form-data
```

Optional profile picture field:

```text
profile_picture
```

Expected success status:

```text
201 Created
```

---

### Search Employees

```http
GET /api/v1/emp/employees/search
```

Supported query parameters:

```text
department
position
```

Examples:

```text
/api/v1/emp/employees/search?department=Engineering
```

```text
/api/v1/emp/employees/search?position=Developer
```

```text
/api/v1/emp/employees/search?department=Engineering&position=Developer
```

Expected success status:

```text
200 OK
```

---

### Get Employee by ID

```http
GET /api/v1/emp/employees/{eid}
```

Returns one employee owned by the authenticated user.

Expected success status:

```text
200 OK
```

---

### Update Employee

```http
PUT /api/v1/emp/employees/{eid}
```

Updates an employee owned by the authenticated user.

Supports multipart form data and optional profile picture replacement.

Expected success status:

```text
200 OK
```

---

### Delete Employee

```http
DELETE /api/v1/emp/employees?eid={employee_id}
```

Deletes an employee owned by the authenticated user.

Expected success status:

```text
204 No Content
```

---

# Employee Data

Employee records contain the following fields:

```text
first_name
last_name
email
position
salary
date_of_joining
department
profile_picture
```

`profile_picture` is optional.

---

# HTTP Status Codes

The API uses appropriate HTTP status codes including:

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Successful deletion |
| 400 | Invalid request or validation failure |
| 401 | Authentication required or invalid token |
| 403 | User does not have permission to access the resource |
| 404 | Resource not found |
| 409 | Resource conflict |
| 429 | Too many requests |
| 500 | Internal server error |

Errors are returned using JSON responses.

---

# Security Features

The backend includes several security controls:

- Password hashing using bcrypt
- JWT authentication
- Bearer token authorization
- Per-user employee ownership
- Input validation
- Helmet security headers
- Restricted CORS configuration
- Authentication rate limiting
- Upload MIME type validation
- 2 MB upload limit
- Unique generated upload filenames
- Protected employee routes
- Environment-based secrets
- Centralized error handling
- Application logging
- No passwords or JWT secrets committed to Git

---

# Environment Variables

Secrets must never be committed to the repository.

Use the provided `.env.example` files as templates.

## Backend

Example:

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/comp3123_assignment2
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:5173
```

The required database name is:

```text
comp3123_assignment2
```

## Frontend

Example:

```env
VITE_API_URL=http://localhost:3000
```

---

# Running with Docker Compose

Docker Compose is the recommended way to run the complete application.

The Docker environment contains four services:

1. MongoDB
2. Mongo Express
3. Express backend
4. React/Nginx frontend

## Prerequisites

Install:

- Docker Desktop
- Docker Compose

---

## Configure Docker Environment

At the project root, create a `.env` file containing a secure JWT secret.

Example:

```env
JWT_SECRET=replace_with_a_secure_random_secret
```

Do not commit this file.

---

## Start the Application

From the project root:

```bash
docker compose up --build
```

To start in detached mode:

```bash
docker compose up -d
```

---

## Docker Application URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

Backend health endpoint:

```text
http://localhost:3000/health
```

Mongo Express:

```text
http://localhost:8082
```

MongoDB is available to the backend internally through the Docker network:

```text
mongodb://mongo:27017/comp3123_assignment2
```

MongoDB is not required to be exposed directly to the host.

---

## View Container Status

```bash
docker compose ps
```

The backend includes a Docker healthcheck using:

```text
GET /health
```

---

## Stop Containers

```bash
docker compose down
```

To stop containers and remove project volumes:

```bash
docker compose down -v
```

WARNING: using `-v` deletes the MongoDB and uploaded-file Docker volumes.

---

# Docker Persistence

Docker named volumes are used for:

- MongoDB data
- Uploaded employee profile pictures
- Backend logs

This allows application data to persist when containers are restarted.

---

# Running Without Docker

## Backend

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`.

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:3000
```

---

## Frontend

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Start Vite:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

# Frontend Routes

Public routes:

```text
/login
/signup
```

Protected routes:

```text
/employees
/employees/add
/employees/:id
/employees/:id/edit
```

Unauthenticated users attempting to access protected routes are redirected to the login page.

---

# Frontend Error Handling

The React application handles common API and validation errors, including:

- Invalid login credentials
- Signup validation errors
- Missing employee fields
- Invalid profile picture types
- Profile pictures larger than 2 MB
- Employee loading failures
- Search errors
- Employee update failures
- Employee deletion failures
- HTTP 401 responses
- HTTP 429 rate-limit responses

A 401 response clears the stored authentication session and redirects the user to the login page.

---

# Testing

The application was tested using the React user interface and Postman.

Testing scenarios include:

- User signup
- User login
- Invalid authentication
- JWT-protected endpoints
- Employee creation
- Employee listing
- Employee details
- Employee updates
- Employee deletion
- Department search
- Position search
- Combined search
- Case-insensitive search
- Partial search
- Search with no results
- Search validation
- JPEG/PNG/WebP profile picture uploads
- Invalid file rejection
- Files larger than 2 MB
- Profile picture replacement
- Profile picture cleanup
- Protected frontend routes
- Logout
- Rate limiting
- User ownership authorization
- Docker backend healthcheck
- Full Docker application startup

---

# Multi-User Authorization

Employee records are associated with the user who created them.

The backend verifies ownership before allowing access, updates, or deletion.

This prevents authenticated users from accessing employee records belonging to another account.

---

# Health Check

The backend exposes:

```http
GET /health
```

This endpoint is also used by Docker Compose to determine backend container health.

---

# Logging

Backend requests and application events are logged through the backend logging system.

Sensitive information such as passwords, JWT secrets, and complete authentication tokens must not be written to application logs.

Docker uses a persistent volume for backend log storage.

---

# Production Build

The React frontend can be compiled using:

```bash
cd frontend
npm run build
```

The production files are generated inside:

```text
frontend/dist
```

The frontend Docker image uses a multi-stage build and serves the compiled React application through Nginx.

---

# Git Workflow

Development was completed using incremental Git commits for major features, including:

- Initial Assignment 2 setup
- CORS and upload dependencies
- CORS configuration
- Employee search API
- Secure profile picture uploads
- React employee management frontend
- Docker Compose full-stack deployment

The repository does not include:

- `node_modules`
- local `.env` files
- production secrets
- generated frontend builds
- application log files
- user-uploaded profile pictures

---

# Submission Notes

Before submission:

- Verify all required API endpoints
- Verify React authentication
- Verify protected routes
- Verify employee CRUD
- Verify backend-powered employee search
- Verify profile picture upload and replacement
- Verify invalid upload rejection
- Verify user ownership authorization
- Verify rate limiting
- Verify Docker healthcheck
- Verify all four Docker services
- Verify MongoDB collections
- Verify hashed passwords
- Verify `.env` files are excluded from Git
- Verify README instructions
- Verify Postman collection
- Verify screenshots/evidence
- Remove `node_modules` from submission ZIP
- Confirm no passwords, JWT secrets, or personal information are included

---

## Author

**Alia Qureshi**  
**Student ID: 101535665**  
**COMP3123 — Full Stack Development**
