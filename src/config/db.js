const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "taskdb",
  password: process.env.DB_PASSWORD || "yourpassword",
  port: process.env.DB_PORT || 5432,
});

pool
  .connect()
  .then(() => console.log("✅ PostgreSQL connected..."))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = pool;
