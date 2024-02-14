
const db = require("../models");
const LoginHistory = db.Login_history;

const checkPreviousLogin = async (req, res, next) => {
  try {
  
    const userId = req.user.user.id; // Access user ID directly from req.user
    const email = req.user.user.email; // Access email directly from req.user
    const ipAddress = req.ip;


    // Check if there is a previous login from the same user ID, email, and IP address where logoutTime is null
    const previousLogin = await LoginHistory.findOne({
      where: { ipAddress, userId, email, logoutTime: null },
    });

    if (previousLogin) {
      // User is already logged in from this IP address and email
      return res.status(403).send({
        message: "User already logged in from this IP address and email",
      });
    }

    // If there is no previous login, proceed with the next middleware or route handler
    next();
  } catch (error) {
    // Handle errors
    console.log(error);
    res
      .status(500)
      .send({ message: "Internal Server Error", err: error.message });
  }
};

module.exports = { checkPreviousLogin };
