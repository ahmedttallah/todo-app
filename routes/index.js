// Packages
const router = require("express").Router();

// Project dependencies
const protect = require("../middleware/protect");
const {
  register,
  login,
  getMe,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require("../controllers");

// @Desc      : Register A New User
// @Method    : [POST]
// @Route     : /api/v1/auth/register
router.post("/auth/register", register);

// @Desc      : User Login
// @Method    : [POST]
// @Route     : /api/v1/auth/login
router.post("/auth/login", login);

// @Desc      : Get User Info
// @Method    : [GET]
// @Route     : /api/v1/auth/me
router.get("/auth/me", protect, getMe);

// @Desc      : Add new Todo
// @Method    : [POST]
// @Route     : /api/v1/todo
router.post("/todo", protect, createTodo);

// @Desc      : Get todo by Id
// @Method    : [GET]
// @Route     : /api/v1/todo/:todoId
router.get("/todo/:todoId", protect, getTodoById);

// @Desc      : Update todo by Id
// @Method    : [PUT]
// @Route     : /api/v1/todo/:todoId
router.put("/todo/:todoId", protect, updateTodo);

// @Desc      : DElete todo by Id
// @Method    : [DELETE]
// @Route     : /api/v1/todo/:todoId
router.delete("/todo/:todoId", protect, deleteTodo);

module.exports = router;
