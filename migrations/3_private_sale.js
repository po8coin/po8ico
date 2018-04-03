var PrivateSaleContract = artifacts.require("./PO8/crowdsale/PrivateSale.sol");
var meta = require('../migrations/meta/meta');
var configFile = require('../migrations/config/config');
var time = require('../migrations/utils/time');
var file = require('../migrations/utils/file');
var currency = require('../migrations/utils/currency');


module.exports = function(deployer, network, accounts) {


    /*PO8 Private Sale*/
    var config = configFile.privateSale.config;
    //the private sale will start in 3 seconds after deployed
    config.open = Date.now() + time.duration.seconds(3);
    config.close = Date.now() + time.duration.days(30);
    config.token = {
        address: meta.po8Token.address
    };
    config.cap = currency.ether(13500);//aprox $9.6m
    config.rate = 5;
    config.minWei = currency.ether(250);//aprox $176K
    config.bonusRate = 0.5;
    config.walletEth = accounts[0];
    config.walletToken = accounts[0];
    config.tx_options.from = accounts[0];
    config.tx_options.gas = 500000000;



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
        //updating meta
        meta.privateSale = {
            config: config,
            address: PrivateSaleContract.address
        };
        file.saveMeta(meta);
    }).catch(function() {
        meta.privateSale = {
            config: config,
            address: PrivateSaleContract.address ? PrivateSaleContract.address : ''
        };
        file.saveMeta(meta);
    });
};