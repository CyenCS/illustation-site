const mysql = require('mysql2');

if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..' , '.env') });
}

const pool = mysql.createPool({
host: process.env.DBHOST,
user: process.env.DBUSER,
password: process.env.DBPASSWORD,
database: process.env.DBNAME,

// #For Render
port: process.env.DBPORT,
ssl: {
    // For local development, you might not need SSL.
    // Remove or adjust the following line if your DB doesn't require SSL.
    rejectUnauthorized: true,
},  
//

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
