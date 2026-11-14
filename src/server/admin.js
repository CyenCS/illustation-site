import { requireLogin, requireAdmin } from './auth'; // Import the requireAdmin middleware

const express = require('express');
const router = express.Router();
const db = require('./connect'); 

function fillMissingDays(rows) {

    const days = [];

    for (let i = 6; i >= 0; i--) {

        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const dateKey = `${year}-${month}-${day}`;

        const record = rows.find(row => row.day === dateKey);

        days.push({
            day: date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
            }),
            total: record ? Number(record.total) : 0
        });
    }

    return days;
}

router.get("/admin/dashboard",requireLogin, requireAdmin, async (req, res) => {
  const countUsers = 'SELECT COUNT(*) AS totalUsers FROM users';
  const countArtworks = 'SELECT COUNT(*) AS totalArtworks FROM artwork';
  
  const [userCount] = await db.query(countUsers);
  const [artworkCount] = await db.query(countArtworks);

  //Daily
  const dailyUsersQuery = 'SELECT DATE(created_at) AS date, COUNT(*) AS newUsers '+ 
  'FROM users GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC LIMIT 7';
  const dailyArtworksQuery = 'SELECT COUNT(*) AS newArtworks FROM artwork '+
  'WHERE created >= CURDATE() - INTERVAL 6 DAY AND created < CURDATE() + INTERVAL 1 DAY';

  const [userCountDaily] = await db.query(dailyUsersQuery);
  const [artworkCountDaily] = await db.query(dailyArtworksQuery);

  //Weekly Graph 
  const dailyUserRegistry = 
  'SELECT DATE_FORMAT(`date`, `%Y-%m-%d`) AS day, COUNT(*) AS total' +
  ' FROM users' +
  ' WHERE `date` >= CURDATE() - INTERVAL 6 DAY' +
  ' AND `date` < CURDATE() + INTERVAL 1 DAY' +
  ' GROUP BY DATE(`date`)' +
  ' ORDER BY day ASC;';

  const [userRegistryData] = await db.query(dailyUserRegistry);

  const dailyArtworkRegistry = 
  'SELECT DATE_FORMAT(`created`, `%Y-%m-%d`) AS day, COUNT(*) AS total' +
  ' FROM artwork' +
  ' WHERE `created` >= CURDATE() - INTERVAL 6 DAY' +
  ' AND `created` < CURDATE() + INTERVAL 1 DAY' +
  ' GROUP BY DATE(`created`)' +
  ' ORDER BY day ASC;';

    const [artworkRegistryData] = await db.query(dailyArtworkRegistry);

const userActivity = fillMissingDays(userRegistryData);
const artworkActivity = fillMissingDays(artworkRegistryData);

  // Recent List


  const countRecentUsers = 
  'SELECT id, name, `date` FROM users ORDER BY `date` DESC LIMIT 5;'

  const [recentUsers] = await db.query(countRecentUsers);

  const countRecentArtworks =
  'SELECT a.artid, a.title, a.image, a.created, u.name AS username' +
  'FROM artwork a' +
  'JOIN users u ON a.userid = u.id' +
  'ORDER BY a.created DESC' +
  'LIMIT 5;'

  const [recentArtworks] = await db.query(countRecentArtworks);

  res.json({ 
    success: true,
    stats: {
        totalUsers: userCount[0].totalUsers,
        totalArtworks: artworkCount[0].totalArtworks,
        newUsers: userCountDaily[0].newUsers,
        newArtworks: artworkCountDaily[0].newArtworks
    },
    userActivity: userActivity,
    artworkActivity: artworkActivity,
    recentUsers: recentUsers,
    recentArtworks: recentArtworks
  });
});

router.get("/admin/userlist", requireAdmin, async (req, res) => {
  const [users] = await db.query("SELECT * FROM users");
  res.json(users);
});


router.get("/admin/postlist", requireAdmin, async (req, res) => {
  const [posts] = await db.query("SELECT * FROM artwork");
  res.json(posts);
});


router.get("/admin/manage", requireAdmin, (req, res) => {

});