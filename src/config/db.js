const pg = require("pg"); // ✅ CommonJS
const dotenv = require("dotenv"); // ✅ CommonJS

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render uchun muhim
  },
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL on Render"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default pool;
