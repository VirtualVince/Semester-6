const { gql } = require('graphql-tag');

const typeDefs = gql`
  # ─── Scalar ─────────────────────────────────────────────────────────────────
  scalar Upload

  # ─── Types ──────────────────────────────────────────────────────────────────

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  # ─── Inputs ─────────────────────────────────────────────────────────────────

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
  }

  # ─── Queries ─────────────────────────────────────────────────────────────────

  type Query {
    # Login using username OR email + password
    login(usernameOrEmail: String!, password: String!): AuthPayload!

    # Get all employees
    getAllEmployees: [Employee!]!

    # Search employee by eid
    searchEmployeeByEid(eid: ID!): Employee!

    # Search employees by designation OR department
    searchEmployeeByDesignationOrDepartment(
      designation: String
      department: String
    ): [Employee!]!
  }

  # ─── Mutations ───────────────────────────────────────────────────────────────

  type Mutation {
    # Register a new user
    signup(input: SignupInput!): User!

    # Add a new employee (with optional photo upload)
    addEmployee(input: AddEmployeeInput!, photo: Upload): Employee!

    # Update employee fields
    updateEmployee(eid: ID!, input: UpdateEmployeeInput!): Employee!

    # Delete employee
    deleteEmployee(eid: ID!): DeleteResponse!
  }
`;

module.exports = typeDefs;
