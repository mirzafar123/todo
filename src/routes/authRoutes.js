const express = require("express");
const {
  signup,
  login,
  getUsers,
  getUserById,
  createAdmin,
} = require("../controllers/authController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, getUserById);
router.post("/create-admin", authMiddleware, adminMiddleware, createAdmin);

module.exports = router;
module.exports = router;
