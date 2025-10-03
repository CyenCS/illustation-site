const express = require('express');
const path = require('path');
const cors = require('cors');
const fetchRoutes = require('./fetch'); 
const db = require('./connect');
const uploadRoutes = require('./illust');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3001;

//Missing this part will cause errors - explicitly allowing credentials like cookies
app.use(cors({
  origin: "http://localhost:3000",  // frontend URL
  credentials: true                 // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// Test DB connection at startup
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    } else {
        console.log('✅ Connected to MySQL database.');
        connection.release();
    }
});

// Routes
app.use('/fetch', fetchRoutes); //API routes for fetching data
app.use('/illust', uploadRoutes);
app.use('/posts', express.static(path.join(__dirname, "..","..", "posts")));

app.listen(PORT, () => {
    console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});

