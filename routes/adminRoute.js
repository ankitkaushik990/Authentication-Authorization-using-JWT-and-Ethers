const express = require("express");

const router = express.Router();
const { createAdmin, allEmp } = require("../controller/adminController");
// const { isAuthenticated } = require("../config/passport.config");
const {isloggedIN} = require("../config/jwt.config")

router.post("/add", isloggedIN, createAdmin);
router.get("/allemp", isloggedIN, allEmp);

module.exports = router;
