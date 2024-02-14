const db = require("../models");
const Company = db.Company;
const User = db.SuperAdmin;

const AppError = require("../middleware/appError");

const createCompany = async (name, description, loggedUser) => {
  const email = loggedUser.email;
  const user = await User.findOne({ where: { email: email } });
  // Find the user by ID from the database
  if (!user) {
    throw new AppError(
      "890",
      "Unauthorized - only Super-Admins are allowed to create company",
      400
    );
  }
  // Check if the user exists and their role is superAdmin
  if (loggedUser.role !== "superAdmin") {
    throw new AppError(
      "890",
      "Unauthorized - only superAdmins are allowed to create company",
      400
    );
  }
  const createdBy = loggedUser.id;

  // Create the company if the user is a superAdmin
  const newCompany = await Company.create({
    name,
    description,
    createdBy,
  });

  return newCompany;
};


module.exports = {
  createCompany,
};
