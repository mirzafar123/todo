const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { nanoid } = require("nanoid");

// SIGNUP
const signup = async (req, res) => {
  try {
    const { username, name, surename, email, password } = req.body;

    // user mavjudmi?
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR username=$2",
      [email, username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // passwordni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10);

    // nanoid orqali custom id
    const customId = "usr_" + nanoid(10);

    // DBga qo‘shish
   const newUser = await pool.query(
     `INSERT INTO users (id, username, name, surename, email, password, role) 
   VALUES ($1, $2, $3, $4, $5, $6, $7) 
   RETURNING id, username, name, surename, email, role`,
     [customId, username, name, surename, email, hashedPassword, "user"]
   );


    res.status(201).json({ msg: "User created", user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // userni topish
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    // passwordni tekshirish
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // JWT token yaratish (id endi string!)
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Foydalanuvchini qaytarish
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        name: user.rows[0].name,
        surename: user.rows[0].surename,
        email: user.rows[0].email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };
// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, name, surename, email FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE USER by id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, username, name, surename, email FROM users WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { username, name, surename, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const customId = "usr_" + nanoid(10);

    const newAdmin = await pool.query(
      `INSERT INTO users (id, username, name, surename, email, password, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username, email, role`,
      [customId, username, name, surename, email, hashedPassword, "admin"]
    );

    res.status(201).json({ msg: "Admin created", user: newAdmin.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { signup, login, getUsers, getUserById,createAdmin };
  
// authController.js
