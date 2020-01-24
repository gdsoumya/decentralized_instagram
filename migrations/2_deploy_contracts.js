var InstaContract = artifacts.require("./InstaContract.sol");

module.exports = function(deployer) {
  deployer.deploy(InstaContract);
};
