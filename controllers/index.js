// Packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Project dependencies
const Users = require("../mongo/models/Users");
const Todo = require("../mongo/models/Todo");

module.exports = {
  register: async (req, res) => {
    try {
      // Extract user information from the request body
      const { name, email, password } = req.body;

      // Check if all data is not empty
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ sucess: false, message: "Missing some fields" });
      }

      // Check if the email is already registered
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });
      }

      // Create a new user
      const user = new Users({ name, email, password });

      // Save the user to the database
      await user.save();

      res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  }, // Register a new user

  login: async (req, res) => {
    try {
      // Extract user information from the request body
      const { email, password } = req.body;

      // Check if all data is provided
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Missing email or password" });
      }

      // Find the user by email
      const user = await Users.findOne(
        { email },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Check if the user is active
      if (!user.is_active) {
        return res
          .status(401)
          .json({ success: false, message: "User is not active" });
      }

      // Compare the provided password with the stored password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      // Remove unnecessary fields
      user.password = "";

      // Send the token in the response
      res.status(200).json({ success: true, token, user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  }, // User login

  // Get the data of the authenticated user
  getMe: async (req, res) => {
    try {
      const { userId } = req;

      // Find the user by ID
      const user = await Users.findById(userId, "-createdAt -updatedAt -__v");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Remove unnecessary fields
      user.password = "";

      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createTodo: async (req, res) => {
    try {
      const { title, description, status } = req.body;
      const { userId } = req;

      const todo = await Todo.create({
        title,
        description,
        status,
        user: userId,
      });

      res.status(201).json({ success: true, todo });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }, // Create a new Todo

  getTodoById: async (req, res) => {
    try {
      const { todoId } = req.params;
      const { userId } = req;

      const todo = await Todo.findOne({ _id: todoId, user: userId });

      if (!todo) {
        return res
          .status(404)
          .json({ success: false, message: "Todo not found" });
      }

      res.status(200).json({ success: true, todo });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }, // Get a specific Todo by ID

  updateTodo: async (req, res) => {
    try {
      const { todoId } = req.params;
      const { userId } = req;
      const { title, description, status } = req.body;

      const todo = await Todo.findOneAndUpdate(
        { _id: todoId, user: userId },
        { title, description, status },
        { new: true }
      );

      if (!todo) {
        return res
          .status(404)
          .json({ success: false, message: "Todo not found" });
      }

      res.status(200).json({ success: true, todo });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }, // Update a Todo

  deleteTodo: async (req, res) => {
    try {
      const { todoId } = req.params;
      const { userId } = req;

      const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });

      if (!todo) {
        return res
          .status(404)
          .json({ success: false, message: "Todo not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Todo deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }, // Delete a Todo

  getTodos: async (req, res) => {
    try {
      const { userId } = req;

      const todos = await Todo.find({ user: userId });

      res.status(200).json({ success: true, todos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }, // Get all Todos for a User
};
