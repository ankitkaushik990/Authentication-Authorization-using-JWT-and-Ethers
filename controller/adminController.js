const AdminService = require("../service/adminService");
const { generateRandomWallet } = require("../utils/etherGen");
const { tryCatch } = require("../utils/tryCatch");
const { AdminEMValidator } = require("../middleware/validator");

const createAdmin = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const user = req.user;

  const { address, privateKey } = generateRandomWallet();
  const walletAddress = address;

  const { name, email, phone, companyId } = req.body;
  const { error } = AdminEMValidator({ name, email, phone, companyId });

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  // check if the email already exist
  await AdminService.emailMatch(email);

  // Check if the logged-in user is a super admin
  await AdminService.isSuperAdmin(user);

  // Check if the company belongs to the logged-in user
  await AdminService.doesCompanyBelongToUser(companyId, userId);

  // Create the admin
  const admin = await AdminService.createAdmin(
    name,
    email,
    phone,
    walletAddress,
    companyId,
    userId
  );

  return res.status(201).json({ admin, privatekey: privateKey });
});

const allEmp = tryCatch(async (req, res) => {
  const user = req.user;
  await AdminService.isAdmin(user);
  const allEmployee = await AdminService.allEmp(user);
  return res.status(200).send(allEmployee);
});

module.exports = {
  createAdmin,
  allEmp,
};
