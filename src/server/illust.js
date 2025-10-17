// Uploads
const express = require('express');
const router = express.Router();
const db = require('./connect'); // Make sure connect.js exports the MySQL pool

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireLogin } = require('./auth');

// const verifyToken = require('../unused/auth');


function generateArtId() {
  return Math.floor(Math.random() * 1e10).toString();
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const artid = req.body.artid || generateArtId();
    if (!req.body.artid){
      req.generatedArtid = artid;
      req.body.artid = artid;
    }

    // Ensure both exist
    if (!artid) return cb(new Error("Missing userid or artid"));

    const dir = path.join(__dirname, '..', '..', 'posts', artid);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, callback) {
    // Generate unique filename: artid + original extension
    const artid = req.body.artid || req.generatedArtid || generateArtId();
    if (req.fileIndex === undefined) req.fileIndex = 0;
    const index = req.fileIndex;
    req.fileIndex += 1;
    const ext = path.extname(file.originalname);
    const filename = `${artid}_p${index}${ext}`;
    
    callback(null, filename)
  }
});

const upload = multer({ storage});


//Upload Artwork
router.post('/upload', requireLogin, upload.array('images', 3), async (req, res) => {
  try{
    const userid = req.body.userid;
    const { title, caption, category, artid } = req.body;
    

    if (!userid || !title || !caption || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields'
      });
    }

    const imagePaths = req.files.map((file) =>
    `${artid}/${file.filename}`
  );
    

  const insertQuery = `INSERT INTO artwork (userid, artid, image, title, caption, category) VALUES (?, ?, ?, ?, ?, ?)`;
  
  await db.promise().query(insertQuery, 
    [ userid, artid, JSON.stringify(imagePaths), title, caption, category ]);

    res.json({
      success: true,
      message: 'Upload successful',
      post: {
    artid,
    userid,
    title,
    caption,
    category,
    image: imagePaths
  } // send the inserted post data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload error: '+err.message });
  }
});


// Redirect to specific post for details
router.get('/posts/:artid', async (req, res) => {
  const { artid } = req.params;

  try {
    const query = `
      SELECT artwork.*, users.name AS username FROM artwork
      INNER JOIN users ON artwork.userid = users.id
      WHERE artwork.artid = ?`;

    const [rows] = await db.promise().query(query, [artid]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const post = rows[0];

    // Images are stored as JSON string
    let images = [];
    try {
      images = JSON.parse(post.image);
    } catch {
      images = [post.image];
    }

    res.json({
      success: true,
      post: {
        artid: post.artid,
        userid: post.userid,
        username: post.username,
        title: post.title,
        caption: post.caption,
        category: post.category,
        created: post.created,
        edited: post.edited,
        images
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
});

router.get('/illusts', async (req, res) => {
  try {
    const {search = ""} = req.query;
    const limit = 10;
  const currentPage = parseInt(req.query.currentPage) || 1;
  const offset = parseInt((currentPage - 1) * limit);
  

    const query = `
      SELECT artwork.*, users.name AS username
      FROM artwork INNER JOIN users ON artwork.userid = users.id
      WHERE artwork.title LIKE ?
      ORDER BY artwork.created DESC
      LIMIT ? OFFSET ?
    `;

    //OFFSET ?
    // offset formula = (current page - 1) * limit
    const params = [`%${search}%`, limit, offset];
    const [rows] = await db.promise()
    .query(query, params);

    const countQuery = `SELECT COUNT(*) AS total FROM artwork WHERE title LIKE ?`;
    const [countRows] = await db.promise().query(countQuery, [`%${search}%`]);
    const total = countRows[0]?.total;
    const maxpage = Math.max(1, Math.ceil(total / limit));

    const posts = rows.map(post => {
      let images = [];
      try {
        images = JSON.parse(post.image);
      } catch {
        images = [post.image];
      }
      return {
        artid: post.artid,
        userid: post.userid,
        username: post.username,
        title: post.title,
        caption: post.caption,
        category: post.category,
        created: post.created,
        firstImage: images[0] || null // ✅ only first image
      };
    });

    res.json({ success: true, posts, total,  maxpage});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "DB error: " + err.message });
  }
});


// ✅ PAGINATION ROUTE
router.get('/recent', async (req, res) => {
  const { userid, limit, offset, keyword } = req.body;
  console.log('Home Pagination request:', req.body);

  const query = 
  `SELECT * FROM artwork
  WHERE created >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
    // `SELECT * FROM items
    // WHERE userid = ? AND itemname LIKE ?
    // LIMIT ? OFFSET ?`;

  // const [rows] = await db.promise().query(query);

  db.query(query, [userid, `%${keyword}%`, limit, offset], (err, results) => {
    if (err) {
      console.error('❌ DB error during pagination:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }

    const totalQuery = `
      SELECT COUNT(*) AS total FROM items
      WHERE userid = ? AND itemname LIKE ?`;

    db.query(totalQuery, [userid, `%${keyword}%`], (countErr, countResult) => {
      if (countErr) {
        console.error('❌ DB count error:', countErr);
        return res.status(500).json({ success: false, message: 'DB count error' });
      }

      console.log('✅ Pagination success:', results.length, 'items');
      res.json({
        success: true,
        data: results,
        total: countResult[0].total
      });
    });
  });
});

module.exports = router;