const express = require('express');
const router = express.Router();
const db = require('./connect'); // Make sure connect.js exports the MySQL pool
const bcrypt = require('bcrypt');
const { requireLogin } = require('./auth');
const crypto = require('crypto');
const { count } = require('console');

//Login
router.post('/login', async (req, res) => {
  const {name, password,} = req.body;
  console.log(req.body); // Add this line to log the request body

  try {
    const [results] = await db.promise().query('SELECT * FROM users WHERE name = ?', [name]);
    
    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'No user found' });
    }
    const user = results[0];
    
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
      }
      user.password = undefined; // Remove password from user object

      // Successful login
      req.session.user = {userid: user.id, name: user.name}; // Store user info in session
      req.session.userid = user.id;
      req.session.username = user.name;

        //A long-term cookie to remember the user that restores session if session expired or browser closed
        const rememberToken = crypto.randomBytes(32).toString('hex');
        await db.promise().query('UPDATE users SET remember_token = ? WHERE id = ?', [rememberToken, user.id]);


      res.cookie('rememberToken', rememberToken, {
        httpOnly: true, //Cookie cannot be read or modified by frontend JavaScript (document.cookie) to prevent XSS's attack/stealing
        secure: process.env.NODE_ENV === 'production', //Cookie is only sent over HTTPS
        maxAge: 1 * 24 * 60 * 60 * 1000, //Automatically expires even if stolen
      });

      req.session.save(err => {
  if (err) {
    console.error("SESSION SAVE ERROR:", err);
    return res.status(500).json({ success: false, message: "Session error" });
  }

  return res.json({
    success: true,
    user: req.session.user
  });
});
    
  } catch (err) {
    console.error('Login error: ',err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/auth/me', (req, res) => {
  if (req.session.userid) {
    res.json({ success: true, user:{userid: req.session.userid, username: req.session.username} });
  } else {
    res.status(401).json({ success: false });
  }
});


//Register
router.post('/registry', async (req, res) => {
  const { name, password } = req.body;

  try{

    const [results] = await db.promise().query('SELECT * FROM users WHERE name = ?', [name]);
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await db.promise().query('INSERT INTO users (name, password) VALUES (?, ?)', [name, hashedPassword]);
      if(!results) throw new Error('Registration failed');
      
      return res.json({ success: true, user: { name: name } });


    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });

router.get('/profile/:profileid', async (req, res) => {
  try{
    const { userid } = req.params;
    const limit = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = parseInt((currentPage - 1) * limit);

    const countQuery = `SELECT COUNT(*) AS total FROM artwork WHERE userid = ?`;
    const [countRows] = await db.promise().query(countQuery, [userid]);
    const total = countRows[0]?.total;
    const maxpage = Math.max(1, Math.ceil(total / limit));

    const query = `
      SELECT artwork.*, users.name AS username
      FROM artwork INNER JOIN userid ON artwork.userid = users.id
      WHERE userid = ?
      ORDER BY artwork.created DESC
      LIMIT ? OFFSET ?
    `;

    const params = [userid, limit, offset];
    const [rows] = await db.promise().query(query, params);
      const posts = rows.map(post => {
      let imagesArray = [];
      try {
        imagesArray = JSON.parse(post.image);
        console.log("Parsed images:", imagesArray);
        
      } catch (e) {
        console.error("Image JSON parse error:", e);
      }
      return {
        ...post,
        firstImage: imagesArray[0], // Return only the first image URL as thumbnail
        // artid: post.artid, ...
      };
    });

    res.json({ success: true, posts, total,  maxpage});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "DB error: " + err.message });
  }
});

router.post('/logout', requireLogin, async (req, res) => {
  try{
    await db.promise().query('UPDATE users SET remember_token = NULL WHERE id = ?', [req.session.userid]);

    res.clearCookie('connect.sid');
    res.clearCookie("rememberToken");
    req.session.destroy( err => {
      if(err){
        return res.status(500).json({ success: false, message: 'Logout error' });
      }
      res.json({success: true, message: 'Logged out successfully' });
    });
  } catch (err){
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



module.exports = router;
