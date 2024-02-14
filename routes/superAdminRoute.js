const express = require("express");


const db = require("../models");
const LoginHistory = db.Login_history;

const router = express.Router();
const {
  registerSuperAdmin,
  allcompany,
} = require("../controller/superAdminController");
const jwtConfig = require("../config/jwt.config");
const { checkPreviousLogin } = require("../middleware/checklogin");

router.post(
  "/login",

  jwtConfig.loginUser,
  checkPreviousLogin,

  async (req, res) => {
    try {
      const userId = req.user.user.id;
      const email = req.user.user.email;
      const ipAddress = req.ip;

      await LoginHistory.create({ ipAddress, userId, email });
      res.send({ message: `user logged in successfully` });
    } catch (err) {
      res
        .status(400)
        .send({ message: "something went wrong", err: err.message });
    }
  }
);


router.post("/register", registerSuperAdmin);

router.get("/logout", jwtConfig.isloggedIN, jwtConfig.logoutUser);

router.get("/allcompany", jwtConfig.isloggedIN, allcompany);

module.exports = router;