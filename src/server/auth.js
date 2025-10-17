function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Session expired or not logged in" });
  }
  next();
}

module.exports = { requireLogin };


//https://medium.com/%40ucangun76/session-and-cookie-management-in-express-js-for-login-and-authentication-bc63ec89e000
//https://medium.com/@mohitgadhavi1/creating-and-managing-cookies-in-node-js-and-react-a-comprehensive-guide-91893a5bbd09