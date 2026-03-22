function requireLogin(req, res, next) {
  try {
    if (!req.session) {
      throw new Error("NO_SESSION_OBJECT");
    }

    if (!req.session.user) {
      throw new Error("USER_NOT_LOGGED_IN");
    }

    // If everything is fine, continue
    next();
  } catch (err) {
    // Catch any error and display it in the message
    return res.status(401).json({
      success: false,
      message: `Session expired or not logged in (${err.message})`
    });
  }
}

const db = require('./connect');
async function authMiddleware (req, res, next) {
  if (req.session.user) { // Extend expiry every visit
    req.session.cookie.expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); 
    req.session.save(() => {
      next();   // Continue processing request (Only for middleware)
    });
  } 
  else if (!req.session.user && req.cookies.rememberToken) { 
    //Restore session from rememberToken
    const token = req.cookies.rememberToken;
    try {
      const [rows] = await db.promise().query('SELECT id, name FROM users WHERE remember_token = ?', [token]);
      if (rows.length > 0) {
        req.session.user = { userid: rows[0].id, name: rows[0].name };
        console.log(`Auto-logged user ${rows[0].name}`);
        res.cookie('rememberToken', token, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      }, 
    );
    req.session.save(() => next() )
    return;
      }
    } catch (err) {
      console.error("Auto-login error:", err);
    }
  }
  else{ next(); }
}


module.exports = { requireLogin, authMiddleware };


//https://medium.com/%40ucangun76/session-and-cookie-management-in-express-js-for-login-and-authentication-bc63ec89e000
//https://medium.com/@mohitgadhavi1/creating-and-managing-cookies-in-node-js-and-react-a-comprehensive-guide-91893a5bbd09