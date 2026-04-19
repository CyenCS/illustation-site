// References
// https://www.npmjs.com/package/multer-storage-cloudinary


const express = require('express');
const router = express.Router();
const db = require('./connect');

const multer = require('multer');
const { requireLogin } = require('./auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const artid = req.body.artid || Math.floor(Math.random() * 1e10).toString();
    if (!req.body.artid) req.body.artid = artid;

    if (req.fileIndex === undefined) req.fileIndex = 0;
    const index = req.fileIndex++;

    return {
      folder: `posts/${artid}`,
      public_id: `${artid}_p${index}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      version: null,
    };
  },
});

const upload = multer({ storage });

//Upload Artwork
router.post('/upload', requireLogin, upload.array('images', 3), async (req, res) => {
  try{
    const userid = req.body.userid;
    const { title, caption, category, artid } = req.body;
    

    if (!userid || !title || !caption || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields'
      });
    }

    //Images being uploaded to Cloudinary
    const stripVersion = (url) => url.replace(/\/v\d+\//, '/');

    const uploadedImages = req.files.map(file => stripVersion(file.path));

    console.log("Upload body:", req.body);
    console.log("Upload files:", req.files);
    

  const insertQuery = 
  `INSERT INTO artwork (userid, artid, image, title, caption, category) 
  VALUES (?, ?, ?, ?, ?, ?)`;
  
  await db.promise().query(insertQuery, 
    [ userid, artid, JSON.stringify(uploadedImages), title, caption, category ]);
    console.log("Images: ", JSON.stringify(uploadedImages));


    res.json({
      success: true,
      message: 'Upload successful',
      post: { artid, userid,
    title, caption, category,
    image: uploadedImages
  } // send the inserted post data
    });

  } catch (err) {
    console.error("Upload failed: ", err);
    res.status(500).json({ success: false, message: 'Upload error: '+err.message });
  }
});

async function verifyartwork(res, artid, userId) {
  const [rows] = await db.promise().query('SELECT userid FROM artwork WHERE artid = ?', [artid]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Artwork not found' });
      return false;
    }

    const postOwner = rows[0].userid;
    if (postOwner !== userId) {
      res.status(403).json({ success: false, message: 'Unauthorized to modify post' });
      return false;
    }

    return true;
}

// // Edit (replace existing)
router.put('/edit/:artid', requireLogin, async (req, res) => {
  try{
    const userid = req.session.userid;
    const {title, caption, artid} = req.body;

    if (!(await verifyartwork(res, artid, userid))) {return;}
    else{
      if (!userid || !title || !caption || !artid) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const edited = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const updateQuery = 
      `UPDATE artwork SET title = ?, caption = ?, edited = ? WHERE artid = ? AND userid = ?`;

      const params = [title, caption, edited, artid, userid];
      const [result] = await db.promise().query(updateQuery, params);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
      }
      res.json({ success: true, message: 'Edit successful' });
    }

  } catch (err) {
    console.error("Edit failed: ", err);
    res.status(500).json({ success: false, message: err.message });
  }

});

// Get post data for editing
router.get('/posts/:artid/editfetch', requireLogin, async (req, res) => {
  try {
    const { artid } = req.params;
    const userid = req.session.userid;
    if (!(await verifyartwork(res, artid, userid))) {return;}
    else{
    // Fetch the post
    const [rows] = await db.promise().query(
      'SELECT * FROM artwork WHERE artid = ?', [artid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const post = rows[0];

    try {
      post.images = JSON.parse(post.image || '[]');
    } catch (e) {
      console.error("Image JSON parse error (edit):", e);
      post.images = [];
    }

    // Return post data for editing
    res.json({ success: true, post });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error: " + err.message });
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
    } catch (e){
      console.error("Image JSON parse error:", e);
    }

    post.images = images;


    res.json({
      success: true,
      post: post,
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
  const currentPage = parseInt(req.query.currentPage);
  const offset = parseInt((currentPage - 1) * limit);
  
  //1) Count Total
  const countQuery = `SELECT COUNT(*) AS total FROM artwork WHERE title LIKE ?`;
    const [countRows] = await db.promise().query(countQuery, [`%${search}%`]);
    const total = countRows[0]?.total;
    const maxpage = Math.max(1, Math.ceil(total / limit));
    const recommend = req.query.recommend;

    //2) Fetch Posts

    let query = `
      SELECT artwork.*, users.name AS username
      FROM artwork INNER JOIN users ON artwork.userid = users.id
      WHERE artwork.title COLLATE utf8mb4_general_ci LIKE ?
    `;
    //case sensitive (for TiDB): utf8mb4_bin, 
    //case insensitive by default (for mysql): utf8mb4_general_ci

    //OFFSET ? // offset formula = (current page - 1) * limit
    const params = [`%${search}%`];
    if (currentPage >= 1 && !recommend) { query += "ORDER BY artwork.created DESC LIMIT ? OFFSET ?;"; params.push(limit, offset);}
    if (recommend) { query += "ORDER BY RAND() LIMIT 5;"; }

    const [rows] = await db.promise().query(query, params);
    

    // 3) Convert image arrays => Cloudinary URLs
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
        firstImage: imagesArray[0], // thumbnail
      };
    });

    res.json({ success: true, posts, total,  maxpage});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "DB error: " + err.message });
  }
});

router.delete('/delete', requireLogin,   async (req, res) => {
  const { artid } = req.body;
  const userid = req.session.userid;

  try {
    if (!(await verifyartwork(res, artid, userid))) {return;}
    else{
      await cloudinary.api.delete_resources_by_prefix(`posts/${artid}`);
    await cloudinary.api.delete_folder(`posts/${artid}`);
      await db.promise().query('DELETE FROM artwork WHERE artid = ?', [artid]);
    
    res.json({ success: true, message: 'Artwork deleted' });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.get('/recent', async (req, res) => {
  const { userid, limit, offset, keyword } = req.body;
  console.log('Home Pagination request:', req.body);

  const query = 
  `SELECT * FROM artwork
  WHERE created >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;

  db.query(query, [userid, `%${keyword}%`, limit, offset], (err, results) => {
    if (err) {
      console.error('database error during pagination:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }

    const totalQuery = `
      SELECT COUNT(*) AS total FROM items
      WHERE userid = ? AND itemname LIKE ?`;

    db.query(totalQuery, [userid, `%${keyword}%`], (countErr, countResult) => {
      if (countErr) {
        console.error('database count error:', countErr);
        return res.status(500).json({ success: false, message: 'DB count error' });
      }
      
      res.json({
        success: true,
        data: results,
        total: countResult[0].total
      });
    });
  });
});

module.exports = router;
