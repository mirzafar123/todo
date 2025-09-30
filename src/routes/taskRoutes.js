// src/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");


// Yangi task qo‘shish
router.post("/", authMiddleware, taskController.createTask);

// Foydalanuvchi tasklarini olish
router.get("/", authMiddleware, taskController.getMyTasks);

// Taskni "done" qilish
router.put("/:id/complete", authMiddleware, taskController.completeTask);

// Taskni o‘chirish
router.delete("/:id", authMiddleware, taskController.deleteTask);

module.exports = router;
