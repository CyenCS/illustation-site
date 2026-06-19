const mysql = require('mysql2');

// if (process.env.NODE_ENV !== 'production') {
//   const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '..' , '.env') });
// }

const pool = mysql.createPool({
host: process.env.DBHOST || 'localhost',
user: process.env.DBUSER || 'root',
password: process.env.DBPASSWORD || 'mysql80.',
database: process.env.DBNAME || 'illustation',

// #For Render
port: process.env.DBPORT,
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,  // ← Change this
//

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
