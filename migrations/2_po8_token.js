var PO8Token = artifacts.require("./PO8/tokens/PO8TokenFlat.sol");
var file = require('../migrations/utils/file');
var meta = require('../migrations/meta/meta');

module.exports = function(deployer, network, accounts) {
    /*PO8 Token*/
    // deployer.deploy(PO8Token, accounts[0], {
    //     gas: 2500000
    // }).then(function(){
    //     /*save token address for private sale migration*/
    //     if(meta.po8Token) {
    //         meta.po8Token.address = PO8Token.address;
    //     } else {
    //         meta.po8Token = {
    //             address: PO8Token.address
    //         };
    //     }
    //     file.saveMeta(meta);
    // });
};
