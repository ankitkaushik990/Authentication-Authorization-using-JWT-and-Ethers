const jwt = require("jsonwebtoken");
const ethers = require("ethers");
const db = require("../models");
const Admin = db.Admin;
const SuperAdmin = db.SuperAdmin;
const Employee = db.Employee;
const LoginHistory = db.Login_history;
const AppError = require("../middleware/appError")


const loginUser = async (req, res) => {
  try {
    const { email, privatekey } = req.body;

    
    let user =
      (await SuperAdmin.findOne({ where: { email } })) ||
      (await Admin.findOne({ where: { email } })) ||
      (await Employee.findOne({ where: { email } }));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
     user = user.get();
    const wallet = new ethers.Wallet(privatekey);
    if (wallet.address.toLowerCase() === user.walletAddress.toLowerCase()) {
      const token = jwt.sign(user, "your-secret-key", { expiresIn: "1h" });

      req.session.token = token;

 const { id, email } = user;
      const ipAddress = req.ip;


      const present = await LoginHistory.findOne({
        where: {
          email: email,
          ipAddress: ipAddress,
          logoutTime: null,
        },
      });
      // checkpreviousLogin(email, ipAddress);
      if (present) {
        res.status(401).send({ message: "user already logged in" });
      }
      else {
        await LoginHistory.create({ userId: id, email, ipAddress });
      

        req.user = user;
        res.json({ message: "Logged in successfully" });
      }
    } else {
      res.status(401).json({ message: "Invalid private key" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const isloggedIN = (req, res, next) => {
  const token = req.session.token; 

  if (!token) {
    return res.status(401).json({ message: "Please Login" });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; 

    next();
  });
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const email = req.user.email;
    const logoutTime = new Date();

    await LoginHistory.update(
      { logoutTime },
      {
        where: {
          userId: userId,
          logoutTime: null, 
          email: email,
        },
      }
    );

  
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error occurred while logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { loginUser, isloggedIN, logoutUser };
