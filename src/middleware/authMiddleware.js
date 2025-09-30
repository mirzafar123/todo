const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query("SELECT * FROM users WHERE id=$1", [
      decoded.id,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user.rows[0]; // token orqali userni qo‘shamiz
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied: Admins only" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
