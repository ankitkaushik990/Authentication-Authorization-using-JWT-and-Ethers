const empService = require("../service/empService");
const { generateRandomWallet } = require("../utils/etherGen");
const { tryCatch } = require("../utils/tryCatch");

const {AdminEMValidator} = require("../middleware/validator")

const createEmp = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const user = req.user;

  const { address, privateKey } = generateRandomWallet();
  const walletAddress = address;

  const { name, email, phone, companyId } = req.body;
  const { error } = AdminEMValidator({ name, email, phone, companyId });

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }



  await empService.emailMatch(email);

  await empService.isAdmin(user);

  await empService.isExist(email);

  await empService.doesCompanyBelongToUser(companyId, user);

  // Create the admin
  const emp = await empService.createEmp(
    name,
    email,
    phone,
    walletAddress,
    companyId,
    userId
  );

  res.status(201).send({ emp, privatekey: privateKey });
});

const updateEmp = tryCatch(async (req, res, next) => {
  const user = req.user;
  // const userId = req.user.id;
  const { name, phone } = req.body;

  await empService.updateEmp(user, name, phone);
  return res.status(201).send({ message: "information updated successfully" });
});

module.exports = {
  createEmp,
  updateEmp,
};
