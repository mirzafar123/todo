const express = require('express');
const pool = require('./src/config/db.js');
require('dotenv').config();
const taskRoutes = require("./src/routes/taskRoutes");
const authRoutes = require("./src/routes/authRoutes");
const app = express();
app.use(express.json())
const PORT = process.env.PORT || 5000;
app.get("/test",async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});
 app.use("/auth", authRoutes);
 app.use("/tasks", taskRoutes);
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});