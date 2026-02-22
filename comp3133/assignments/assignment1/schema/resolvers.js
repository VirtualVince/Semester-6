const { GraphQLError } = require('graphql');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { generateToken } = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

// Helpers
/**
 * Throws a formatted GraphQL error.
 * @param {string} message  
 * @param {string} code     Apollo error code, e.g. 'BAD_USER_INPUT'.
 */
const throwError = (message, code = 'BAD_USER_INPUT') => {
  throw new GraphQLError(message, { extensions: { code } });
};

const uploadToCloudinary = async (stream, folder = 'employee_photos') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        resolve(result.secure_url);
      }
    );
    stream.pipe(uploadStream);
  });
};

// Resolvers
const resolvers = {
  Query: {
    // Login 
    login: async (_, { usernameOrEmail, password }) => {
      if (!usernameOrEmail || !password) {
        throwError('Username/Email and password are required.');
      }

      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      if (!user) throwError('Invalid credentials. User not found.', 'UNAUTHENTICATED');

      const isMatch = await user.matchPassword(password);
      if (!isMatch) throwError('Invalid credentials. Incorrect password.', 'UNAUTHENTICATED');

      const token = generateToken(user._id);
      return { token, user };
    },

    // Get all employees 
    getAllEmployees: async (_, __, { user }) => {
      if (!user) throwError('Authentication required.', 'UNAUTHENTICATED');
      const employees = await Employee.find();
      return employees;
    },

    // Search employee by ID 
    searchEmployeeByEid: async (_, { eid }, { user }) => {
      if (!user) throwError('Authentication required.', 'UNAUTHENTICATED');

      const employee = await Employee.findById(eid);
      if (!employee) throwError(`No employee found with id: ${eid}`, 'NOT_FOUND');
      return employee;
    },

    // Search by designation OR department 
    searchEmployeeByDesignationOrDepartment: async (
      _,
      { designation, department },
      { user }
    ) => {
      if (!user) throwError('Authentication required.', 'UNAUTHENTICATED');

      if (!designation && !department) {
        throwError('At least one of designation or department must be provided.');
      }

      const query = { $or: [] };
      if (designation) query.$or.push({ designation: new RegExp(designation, 'i') });
      if (department)  query.$or.push({ department:  new RegExp(department,  'i') });

      return await Employee.find(query);
    },
  },

  Mutation: {
    // Signup
    signup: async (_, { input }) => {
      const { username, email, password } = input;

      if (!username || !email || !password) {
        throwError('All fields (username, email, password) are required.');
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throwError('Please enter a valid email address.');
      }
      if (password.length < 6) {
        throwError('Password must be at least 6 characters long.');
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) throwError('Username is already taken.');

      const existingEmail = await User.findOne({ email });
      if (existingEmail) throwError('Email is already registered.');

      const user = await User.create({ username, email, password });
      return user;
    },

    // Add employee 
    addEmployee: async (_, { input, photo }, { user }) => {
      if (!user) throwError('Authentication required.', 'UNAUTHENTICATED');

      const {
        first_name, last_name, email, gender,
        designation, salary, date_of_joining, department,
      } = input;

      // Validate required fields
      if (!first_name || !last_name || !email || !designation || !department || !date_of_joining) {
        throwError('All required fields must be provided.');
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) throwError('Invalid employee email.');
      if (salary < 1000) throwError('Salary must be at least 1000.');
      if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
        throwError('Gender must be Male, Female, or Other.');
      }

      const existing = await Employee.findOne({ email });
      if (existing) throwError('An employee with this email already exists.');

      let employee_photo = null;

      // Handle optional photo upload to Cloudinary
      if (photo) {
        try {
          const { createReadStream } = await photo;
          const stream = createReadStream();
          employee_photo = await uploadToCloudinary(stream);
        } catch (err) {
          throwError(`Photo upload failed: ${err.message}`);
        }
      }

      const employee = await Employee.create({
        first_name, last_name, email, gender,
        designation, salary,
        date_of_joining: new Date(date_of_joining),
        department, employee_photo,
      });

      return employee;
    },

    // Update employee
    updateEmployee: async (_, { eid, input }, { user }) => {
      if (!user) throwError('Authentication required.', 'UNAUTHENTICATED');

      const employee = await Employee.findById(eid);
      if (!employee) throwError(`No employee found with id: ${eid}`, 'NOT_FOUND');

      // Validate fields if provided
      if (input.email && !/^\S+@\S+\.\S+$/.test(input.email)) {
        throwError('Invalid email address.');
      }
      if (input.salary !== undefined && input.salary < 1000) {
        throwError('Salary must be at least 1000.');
      }
      if (input.gender && !['Male', 'Female', 'Other'].includes(input.gender)) {
        throwError('Gender must be Male, Female, or Other.');
      }
      if (input.email) {
        const dup = await Employee.findOne({ email: input.email, _id: { $ne: eid } });
        if (dup) throwError('Another employee already uses this email.');
      }

      if (input.date_of_joining) {
        input.date_of_joining = new Date(input.date_of_joining);
      }

      const updated = await Employee.findByIdAndUpdate(
        eid,
        { $set: input },
        { new: true, runValidators: true }
      );

      return updated;
    },

    // Delete employee 
    deleteEmployee: async (_, { eid }, { user }) => {
      if (!user) throwError('Authentication required.', 'UNAUTHENTICATED');

      const employee = await Employee.findById(eid);
      if (!employee) throwError(`No employee found with id: ${eid}`, 'NOT_FOUND');

      await Employee.findByIdAndDelete(eid);

      return { success: true, message: `Employee with id ${eid} deleted successfully.` };
    },
  },
};

module.exports = resolvers;
