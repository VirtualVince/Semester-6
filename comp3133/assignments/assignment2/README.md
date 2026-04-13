# COMP3133 Assignment 2 — Angular Employee Management Frontend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your backend GraphQL URL in:
   ```
   src/app/app-module.ts
   ```
   Change `http://localhost:4000/graphql` to your deployed backend URL.

3. Run the development server:
   ```bash
   ng serve
   ```
   Open: http://localhost:4200

## Build for Production
```bash
ng build
```

## Features
- Login / Signup with validation
- JWT session management via service
- Employee List with Material table
- Add Employee with photo upload
- View Employee details
- Edit Employee information
- Delete Employee with confirmation
- Search by Department or Designation
- Angular Material UI (indigo/pink theme)
- Auth Guard protecting all employee routes
- Responsive design

## Backend Required GraphQL Queries
Make sure your Assignment 1 backend supports:
- `login(username, password)` → `{ token, user }`
- `signup(username, email, password)` → `{ _id, username, email }`
- `getAllEmployees` → `[Employee]`
- `searchEmployeeById(eid)` → `Employee`
- `searchEmployeeByDepOrDes(department, designation)` → `[Employee]`
- `addEmployee(...)` → `Employee`
- `updateEmployee(eid, ...)` → `Employee`
- `deleteEmployee(eid)` → `Employee`
