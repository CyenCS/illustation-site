const express = require('express');
const path = require('path');
const cors = require('cors');
const fetchRoutes = require('./fetch'); 
const db = require('./connect');
const uploadRoutes = require('./illust');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
