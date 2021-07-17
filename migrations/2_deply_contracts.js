const EscoToken = artifacts.require("EscoToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
    // Deploy mock dai token
    await deployer.deploy(DaiToken);
    const daiToken = await DaiToken.deployed();

    // Deploy esco token
    await deployer.deploy(EscoToken);
    const escoToken = await EscoToken.deployed();

    // Deploy TokenFarm
    await deployer.deploy(TokenFarm, escoToken.address, daiToken.address);
    const tokenFarm = await TokenFarm.deployed();

    // Transfer all tokens to the token TokenFarm
    await escoToken.transfer(tokenFarm.address, '1000000000000000000000000');

    // Transfer 100 mDai tokens to an investor
    await daiToken.transfer(accounts[1], '100000000000000000000');
};
