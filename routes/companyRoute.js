const express = require("express");
const router = express.Router();

const { createCompany } = require("../controller/companyController");
// const { isAuthenticated } = require("../config/passport.config");
const { isloggedIN} = require("../config/jwt.config")

router.post("/addcompany", isloggedIN, createCompany);

module.exports = router;
