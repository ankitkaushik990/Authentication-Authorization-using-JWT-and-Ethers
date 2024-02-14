const db = require("../models");

const Emp = db.Employee;
const Admin = db.Admin;
const Company = db.Company;

const AppError = require("../middleware/appError");
const isMatch = require("../utils/checkEmail");
const createEmp = async (
  name,
  email,
  phone,
  walletAddress,
  companyId,
  createdBy
) => {
  const emp = await Emp.create({
    name,
    email,
    phone,
    walletAddress,
    companyId,
    createdBy,
  });

  return emp;
};

const emailMatch = async (email) => {
  const match = await isMatch(email);
  if (match) {
    throw new AppError("454", "Email already exist", 400);
  }
  return match;
};

const isExist = async (email) => {
  const user = await Emp.findOne({ where: { email: email } });
  if (user) {
    throw new AppError("890", "Employee already exists", 400);
  }
};

const isAdmin = async (loggeduser) => {
  const email = loggeduser.email;
  const user = await Admin.findOne({ where: { email: email } });

  // const user = await Admin.findByPk(userId);
  if (!user) {
    throw new AppError("120", "OOPS! only admin can add employee", 400);
  }
  const isAdmin = loggeduser.role === "admin";

  if (!isAdmin) {
    throw new AppError("199", "Unauthorized - not Admin", 400);
  }

  return isAdmin;
};

const doesCompanyBelongToUser = async (companyId, loggeduser) => {
  const company = await Company.findByPk(companyId);

  if (!company) {
    throw new AppError("120", "company not found", 400);
  }

  const belongsTocomp = companyId === loggeduser.companyId;

  if (!belongsTocomp) {
    throw new AppError("129", "Unauthorized to add emp. for this company", 400);
  }

  return belongsTocomp;
};

const updateEmp = async (loggeduser, name, phone) => {
  const email = loggeduser.email;
  const emp = await Emp.findOne({ where: { email: email } });

  if (!emp) {
    throw new AppError("661", "employee not found to update details", 400);
  }
  // Update user details
  emp.name = name;
  emp.phone = phone;
  await emp.save();
  return emp;
};

module.exports = {
  createEmp,
  isAdmin,
  doesCompanyBelongToUser,
  updateEmp,
  isExist,
  emailMatch,
};
