require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();





// Set JWT secret with fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-default-secret';

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // allow both localhost and 127.0.0.1
  credentials: true
}));

app.use(express.json());

let pool;

async function initDB() {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bookease2',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

initDB();

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        profile_image: user.profile_image || null,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Signup route - automatically logs user in after signup
app.post('/api/signup', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, 'user'] // default role 'user'
    );

    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        first_name,
        last_name,
        email,
        profile_image: null,
        role: 'user'
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/listings/pending', async (req, res) => {
  console.log('Received GET /api/listings/pending request'); // Backend log on request arrival

  try {
    const [pendingListings] = await pool.query(`
      SELECT 
        l.id, l.title, l.type, l.image_url, l.created_at,
        CONCAT(u.first_name, ' ', u.last_name) AS host_name
      FROM listings l
      JOIN users u ON u.id = l.host_id
      WHERE l.status = 'pending'
      ORDER BY l.created_at DESC
    `);
    console.log('Fetched pending listings from DB:', pendingListings.length); // Log DB query result count
    res.json(pendingListings);
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
