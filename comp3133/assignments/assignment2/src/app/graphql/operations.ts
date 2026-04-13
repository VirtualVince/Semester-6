import { gql } from 'apollo-angular';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user { _id username email }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      _id
      username
      email
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
      employee_photo
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    searchEmployeeById(eid: $id) {
      _id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
      employee_photo
    }
  }
`;

export const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($department: String, $designation: String) {
    searchEmployeeByDepOrDes(department: $department, designation: $designation) {
      _id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
      employee_photo
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String!
    $designation: String!
    $department: String!
    $salary: Float!
    $date_of_joining: String!
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      department: $department
      salary: $salary
      date_of_joining: $date_of_joining
      employee_photo: $employee_photo
    ) {
      _id
      first_name
      last_name
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $first_name: String
    $last_name: String
    $email: String
    $gender: String
    $designation: String
    $department: String
    $salary: Float
    $date_of_joining: String
    $employee_photo: String
  ) {
    updateEmployee(
      eid: $id
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      department: $department
      salary: $salary
      date_of_joining: $date_of_joining
      employee_photo: $employee_photo
    ) {
      _id
      first_name
      last_name
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(eid: $id) {
      _id
    }
  }
`;
