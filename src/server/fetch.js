const express = require('express');
const router = express.Router();
const db = require('./connect'); // Make sure connect.js exports the MySQL pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;


//Login
router.post('/login', (req, res) => {
  console.log(req.body); // Add this line to log the request body
  const {name, password} = req.body;

  db.query('SELECT * FROM users WHERE name = ?', [name], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error'})
      console.log('DB results:', results);
    
    if (results.length === 0) {
      console.log('No user found');
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
    const user = results[0];
    try{
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
      }
      user.password = undefined; // Remove password from user object
       const accessToken = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id, name: user.name }, REFRESH_SECRET, { expiresIn: "7d" });

    // ✅ Store refresh token in cookie (HTTP-only)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

      if (!JWT_SECRET) {
  console.error('Token Error');
  return res.status(500).json({ success: false, message: 'Server JWT configuration error' });
}

      // Successful login
      return res.json({
        success: true,
        accessToken,
        user: { name: user.name, id: user.id }});
      
    } catch (err) {
      console.error('Error comparing passwords:', err);
      return res.status(500).json({ success: false, message: 'Error comparing passwords' });
    }
    
  })
});

//Register
router.post('/registry', async (req, res) => {
  const { name, password } = req.body;

  db.query('SELECT * FROM users WHERE name = ?', [name], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      db.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error creating account' });
        }

        return res.json({ success: true, 
          user: { name: name }
        });
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
});


// Refresh access token
router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ success: false, message: "No refresh token" });

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Invalid refresh token" });

    // Issue new access token
    const newAccessToken = jwt.sign(
      { id: user.id, name: user.name },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ success: true, accessToken: newAccessToken });
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true in production
  });
  res.json({ success: true, message: "Logged out" });
});



module.exports = router;
