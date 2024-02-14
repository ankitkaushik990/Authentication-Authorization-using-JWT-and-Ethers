const authService = require("../service/superAdminService");
const { generateRandomWallet } = require("../utils/etherGen");
const { SuperAdminValidator } = require("../middleware/validator");
const { tryCatch } = require("../utils/tryCatch");
const AppError = require("../middleware/appError");

const db = require("../models");
const LoginHistory = db.Login_history;


const passport = require("passport");

const registerSuperAdmin = tryCatch(async (req, res) => {
  // Get request data
  const { address, publicKey, privateKey } = generateRandomWallet();
  const walletAddress = address;
  const publicKeywallet = publicKey;
  const privatekey = privateKey;
  const { name, email, phone, secretCode } = req.body;



  const { error } = SuperAdminValidator({
    name,
    email,
    phone,
    secretCode,
  });

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }


  await authService.emailMatch(email);

  // Call the service to register super admin
  await authService.registerSuperAdmin(
    name,
    email,
    phone,
    walletAddress,
    publicKeywallet,
    secretCode
  );


  return res.status(201).send({ privatekey });
});

const loginUser = passport.authenticate("local");

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

    req.logout(function (err) {
      if (err) {
        return res.status(400).send("Something Went wrong");
      }
      res.send("Logged out successfully");
    });
  } catch (error) {
    res.status(400).send("Something Went wrong");
  }
};


const allcompany = tryCatch(async (req, res, next) => {
  const user = req.user;

  // Check if the logged-in user is a super admin
  await authService.isSuperAdmin(user);

  const allC = await authService.allcompany(user);
  res.send(allC);
});

module.exports = {
  registerSuperAdmin,
  loginUser,
  logoutUser,
  allcompany,
};
