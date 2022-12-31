const luckySevenERC20 = artifacts.require("luckySevenERC20");

module.exports = function (deployer) {
  deployer.deploy(luckySevenERC20);
};
