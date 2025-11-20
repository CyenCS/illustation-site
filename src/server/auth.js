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


module.exports = { requireLogin };


//https://medium.com/%40ucangun76/session-and-cookie-management-in-express-js-for-login-and-authentication-bc63ec89e000
//https://medium.com/@mohitgadhavi1/creating-and-managing-cookies-in-node-js-and-react-a-comprehensive-guide-91893a5bbd09