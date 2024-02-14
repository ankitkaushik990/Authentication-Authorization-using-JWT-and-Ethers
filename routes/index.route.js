const express = require("express");
const router = express.Router();

router.use("/user", require("./superAdminRoute"));
router.use("/company", require("./companyRoute"));
router.use("/admin", require("./adminRoute"));
router.use("/emp", require("./empRoute"));

module.exports = router;

