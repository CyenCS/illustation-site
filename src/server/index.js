const express = require('express');
const path = require('path');
const cors = require('cors');
const fetchRoutes = require('./fetch'); 
const db = require('./connect');
const uploadRoutes = require('./illust');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { authMiddleware } = require('./auth');

const app = express();

const KEY_SECRET = process.env.KEY_SECRET;


const allowedOrigins = ["http://localhost:3000", "https://illustation-site.vercel.app", "https://illustation-site.onrender.com" ];
app.use(cors({
  origin: 
  function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: true                 // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// Test DB connection at startup
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        // process.exit(1);
    } else {
        console.log('Connected to the server database.');
        connection.release();
    }
});

//https://darifnemma.medium.com/how-to-store-session-in-mysql-database-using-express-mysql-session-ae2f67ef833e

const MySQLStore = require('express-mysql-session')(session); 
// ^ Automatically creates sessions table if not exists for the database

let sessionStore;
try {
  sessionStore = new MySQLStore({ 
    expiration: 24 * 60 * 60 * 1000,  // 24 hour expiration
    createDatabaseTable: true 
  }, db.promise()); 
  console.log('Session store initialized');
} catch (err) {
  console.warn('Session store initialization failed, using memory store:', err.message);
  // Fallback to simple in-memory session storage
  sessionStore = {
    get: function() {},
    set: function() {},
    destroy: function() {}
  };
}

app.set("trust proxy", 1);
app.use(session({
  //Session cleanup on server
    secret: KEY_SECRET,
    store: sessionStore,
    resave: false, // false - Don't save session if unmodified
    saveUninitialized: false, //false - Don't create session until something is stored
    rolling: true, // Refresh cookie expiry on each request
    cookie: {
        httpOnly: true,
        secure: true, 
        sameSite: "none",
        maxAge: 1 * 24 * 60 * 60 * 1000
    }
}))

app.use(authMiddleware);


// Routes
app.use('/fetch', fetchRoutes);
app.use('/illust', uploadRoutes);
app.use('/posts', express.static(path.join(__dirname, "..","..", "posts")));

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("Server is running on port " + PORT);