const Migrations = artifacts.require("Migrations");

console.log("Run Migration");
console.log(artifacts.require);
module.exports = function (deployer) {
  console.log(deployer);
  deployer.deploy(Migrations);
};
