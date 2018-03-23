

var PO8Token = artifacts.require("./PO8/tokens/PO8Token.sol");




module.exports = async function(deployer, network, accounts) {


    /*PO8 Token*/
    var result = await deployer.deploy(PO8Token, accounts[0]);



};
