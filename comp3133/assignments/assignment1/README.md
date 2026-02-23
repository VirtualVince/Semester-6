# COMP3133_101484793_Assignment1

> **Employee Management System** – Full Stack Development II (COMP 3133)  
> Backend API built with **Node.js · Express · Apollo GraphQL · MongoDB**

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [GraphQL API Reference](#graphql-api-reference)
- [Sample User Credentials](#sample-user-credentials)
- [Project Structure](#project-structure)

---

## Tech Stack

| Layer        | Technology                           |
|--------------|--------------------------------------|
| Runtime      | Node.js 18+                          |
| Framework    | Express 4                            |
| API          | Apollo Server 4 + GraphQL 16         |
| Database     | MongoDB + Mongoose                   |
| Auth         | JSON Web Tokens (JWT) + bcryptjs     |
| File Upload  | Cloudinary + graphql-upload          |
| Validation   | express-validator + Mongoose schemas |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas connection string
- A free [Cloudinary](https://cloudinary.com) account

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/VirtualVince/Semester-6/tree/main/comp3133/assignments/assignment1
cd assignment1

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env
#    → Fill in MONGODB_URI, JWT_SECRET and Cloudinary credentials

# 4. Start the development server
npm run dev

# 5. Open GraphQL Sandbox
#    http://localhost:4000/graphql
```

---

## Environment Variables

Create a `.env` file

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/
Assigment1
JWT_SECRET= your own token

CLOUDINARY_CLOUD_NAME= your own name
CLOUDINARY_API_KEY= your own token
CLOUDINARY_API_SECRET= your own token
```

---

## GraphQL API Reference

All requests go to `POST /graphql`.  
Protected routes require the header: `Authorization: Bearer <token>`

### 1 · Signup (Mutation)
```graphql
mutation {
  signup(input: {
    username: "johndoe"
    email: "john@example.com"
    password: "password123"
  }) {
    _id
    username
    email
    created_at
  }
}
```

### 2 · Login (Query)
```graphql
query {
  login(usernameOrEmail: "johndoe", password: "password123") {
    token
    user {
      _id
      username
      email
    }
  }
}
```

### 3 · Get All Employees (Query) 🔒
```graphql
query {
  getAllEmployees {
    _id
    first_name
    last_name
    email
    designation
    department
    salary
    date_of_joining
    employee_photo
  }
}
```

### 4 · Add Employee (Mutation) 🔒
```graphql
mutation {
  addEmployee(input: {
    first_name: "Jane"
    last_name: "Smith"
    email: "jane.smith@company.com"
    gender: "Female"
    designation: "Software Engineer"
    salary: 75000
    date_of_joining: "2024-01-15"
    department: "Engineering"
  }) {
    _id
    first_name
    last_name
    employee_photo
  }
}
```

### 5 · Search Employee by ID (Query) 🔒
```graphql
query {
  searchEmployeeByEid(eid: "65f1a2b3c4d5e6f7a8b9c0d1") {
    _id
    first_name
    last_name
    designation
    department
  }
}
```

### 6 · Update Employee (Mutation) 🔒
```graphql
mutation {
  updateEmployee(
    eid: "65f1a2b3c4d5e6f7a8b9c0d1"
    input: {
      salary: 80000
      designation: "Senior Software Engineer"
    }
  ) {
    _id
    designation
    salary
    updated_at
  }
}
```

### 7 · Delete Employee (Mutation) 🔒
```graphql
mutation {
  deleteEmployee(eid: "65f1a2b3c4d5e6f7a8b9c0d1") {
    success
    message
  }
}
```

### 8 · Search by Designation or Department (Query) 🔒
```graphql
query {
  searchEmployeeByDesignationOrDepartment(
    designation: "Engineer"
    department: "Engineering"
  ) {
    _id
    first_name
    last_name
    designation
    department
  }
}
```

---

## Sample User Credentials

Use these pre-seeded credentials to test the login endpoint:

| Field    | Value              |
|----------|--------------------|
| username | `testuser`         |
| email    | `test@example.com` |
| password | `password123`      |

---

## Project Structure

```
COMP3133_101XXXXXXX_Assignment1/
├── config/
│   ├── db.js            # MongoDB connection
│   └── cloudinary.js    # Cloudinary configuration
├── middleware/
│   └── auth.js          # JWT helpers
├── models/
│   ├── User.js          # User Mongoose schema
│   └── Employee.js      # Employee Mongoose schema
├── schema/
│   ├── typeDefs.js      # GraphQL type definitions
│   └── resolvers.js     # GraphQL resolvers
├── .env.example         # Environment variable template
├── .gitignore
├── package.json
├── README.md
└── server.js            # Application entry point
```

---

## Notes
- Salary minimum is **1000**.
- Gender accepted values: `Male`, `Female`, `Other`.
- Employee photos are stored on Cloudinary; the `employee_photo` field holds the secure URL.

---

*Submitted for COMP 3133 – Full Stack Development II · George Brown College*
