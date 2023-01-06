const Migrations = artifacts.require("certificateNFT");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
