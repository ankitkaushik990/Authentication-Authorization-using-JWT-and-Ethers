const express = require("express");

const router = express.Router();
const { createEmp, updateEmp } = require("../controller/empControlller");
// const { isAuthenticated } = require("../config/passport.config");
const { isloggedIN } = require("../config/jwt.config");

router.post("/addemp", isloggedIN, createEmp);
router.put("/update", isloggedIN, updateEmp);
module.exports = router;
