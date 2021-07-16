// migrations/2_deploy.js
const Bike = artifacts.require('BikeContract');

module.exports = async function (deployer) {
  await deployer.deploy(Bike);
};