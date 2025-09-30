// src/controllers/taskController.js
const pool = require("../config/db");
const { nanoid } = require("nanoid");

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.id; // auth middleware orqali keladi
    const taskId = "task_" + nanoid(10); // ID generatsiya qilamiz

    const result = await pool.query(
      "INSERT INTO tasks (id, title, description, deadline, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [taskId, title, description, deadline, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};
// Foydalanuvchi tasklarini olish
exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
      userId,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Taskni "done" qilish
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "UPDATE tasks SET status = 'done' WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ msg: "Task topilmadi" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Taskni o‘chirish
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ msg: "Task topilmadi" });

    res.json({ msg: "Task o‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
