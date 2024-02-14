const ethers = require("ethers");

function generateRandomWallet() {
  const randomWallet = ethers.Wallet.createRandom();
  const address = randomWallet.address;
  const publicKey = randomWallet.publicKey;
  const privateKey = randomWallet.privateKey;
  return { address, privateKey, publicKey };
}

module.exports = {
  generateRandomWallet,
};
