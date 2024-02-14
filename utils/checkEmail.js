const db = require("../models");
const SuperAdmin = db.SuperAdmin;
const employee = db.Employee;
const Admin = db.Admin;


async function checkEmailExistence(email) {
  const isSuperAdmin = await SuperAdmin.findOne({
    where: {
      email: email,
    },
  });
   const isExistingAdmin = await Admin.findOne({
    where: {
      email: email,
    },
  });

  const isExistingEmployee = await employee.findOne({
    where: {
      email: email,
    },
  });

  return isSuperAdmin || isExistingAdmin || isExistingEmployee;
}

module.exports = checkEmailExistence;
