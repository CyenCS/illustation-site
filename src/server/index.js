const express = require('express');
const path = require('path');
const cors = require('cors');
const fetchRoutes = require('./fetch'); 
const db = require('./connect');
const uploadRoutes = require('./illust');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const PORT = 3001;



require('dotenv').config({ path: path.join(__dirname, '.env') });
const KEY_SECRET = process.env.KEY_SECRET;
// const REFRESH_SECRET = process.env.REFRESH_SECRET;

//Missing this part will cause errors - explicitly allowing credentials like cookies
const allowedOrigins = ["http://localhost:3000", "https://illustation-site.vercel.app/"]; // Frontend URL 
app.use(cors({
  origin: allowedOrigins, //Domains allowed to access the server
  
  credentials: true                 // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// Test DB connection at startup
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    } else {
        console.log('Connected to the server database.');
        connection.release();
    }
});

//https://darifnemma.medium.com/how-to-store-session-in-mysql-database-using-express-mysql-session-ae2f67ef833e

const MySQLStore = require('express-mysql-session')(session); 
// ^ Automatically creates sessions table if not exists for the database

const sessionStore = new MySQLStore({}, db.promise()); // Reuses the existing db connection
// !!!!!!NOTICE!!!!
//Not including this part will cause error if the server restarted/initiated while users already logged in
//Although unless the user logged in again, the session will be lost if server restarted
app.use(session({
  //Session cleanup on server
    secret: KEY_SECRET,
    store: sessionStore,
    resave: false, // false - Don't save session if unmodified
    saveUninitialized: false, //false - Don't create session until something is stored
    rolling: true, // Refresh cookie expiry on each request
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
        maxAge: 1 * 1 * 60 * 60 * 1000 // 1 hour for testing
    }
}))

//Middleware logic
app.use(async (req, res, next) => {
  if (req.session.user) { // Extend expiry every visit
    req.session.cookie.expires = new Date(Date.now() + 1 * 2 * 60 * 60 * 1000); 
  } 
  else if (!req.session.user && req.cookies.rememberToken) { 
    //Restore session from rememberToken
    const token = req.cookies.rememberToken;
    try {
      const [rows] = await db.promise().query('SELECT id, name FROM users WHERE remember_token = ?', [token]);
      if (rows.length > 0) {
        req.session.user = { id: rows[0].id, name: rows[0].name };
        console.log(`Auto-logged user ${rows[0].name}`);
        res.cookie('rememberToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      }
    } catch (err) {
      console.error("Auto-login error:", err);
    }
  }
  next();
});


// Routes
app.use('/fetch', fetchRoutes); //API routes for fetching data
app.use('/illust', uploadRoutes);
app.use('/posts', express.static(path.join(__dirname, "..","..", "posts")));

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});

