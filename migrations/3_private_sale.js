var PrivateSale = artifacts.require("./PO8/crowdsale/PrivateSale.sol");
var meta = require('../migrations/meta/meta');

module.exports = function(deployer, network, accounts) {


    /*PO8 Private Sale*/

    var config = {
        token: {
            address: meta.po8Token.address
        }
    };


    /*deployer.deploy(PrivateSale, accounts[0]).then(function(){
    });*/
};