const Migrations = artifacts.require("Migrations");
const USDTMock = artifacts.require("USDTMock");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(USDTMock);
};
