import pg from "pg";
import dotenv from "dotenv";

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
