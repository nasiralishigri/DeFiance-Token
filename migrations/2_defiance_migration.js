const DeFiance = artifacts.require("DeFiance");

module.exports = function(deployer,network,accounts) {
    const owner = accounts[0];//'0xCb78ea3bD45265fcFbD7a00445C65b39d315c68a';
  deployer.deploy(DeFiance, owner);
};
