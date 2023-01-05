const luckyCardsNFT = artifacts.require("luckyCardsNFT");

module.exports = function (deployer) {
  deployer.deploy(luckyCardsNFT);
};
