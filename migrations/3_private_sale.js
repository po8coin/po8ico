var PrivateSaleContract = artifacts.require("./PO8/crowdsale/PrivateSale.sol");
var meta = require('../migrations/meta/meta');
var configFile = require('../migrations/config/config');

module.exports = function(deployer, network, accounts) {


    /*PO8 Private Sale*/
    let config = configFile.privateSale.config;
    //the private sale will start in 3 seconds after deployed
    config.open = Date.now() + 3;
    config.token = {
        address: meta.po8Token.address
    };



    deployer.deploy(
        PrivateSaleContract,
        config.open,
        config.close,
        config.cap,
        config.rate,
        config.bonusRate,
        config.minWei,
        config.walletEth,
        config.token.address,
        config.walletToken,
        config.tx_options
    ).then(function(){
        //post deployment set up

    });
};