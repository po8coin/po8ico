var PrivateSale = artifacts.require("./PO8/crowdsale/PrivateSale.sol");
var meta = require('../migrations/meta/meta');
var latestTime = require('../test/helpers/latestTime');
var ether = require('../test/helpers/ether');
var duration = require('../test/helpers/increaseTime').duration;

module.exports = function(deployer, network, accounts) {

    console.log(deployer);
    /*PO8 Private Sale*/
    console.log(latestTime.default());
    var openTime =  latestTime.default() + 3;//the private sale will start in 3 seconds after deployed
    var config = {
        token: {
            address: meta.po8Token.address
        },
        privateSale: {
            open: openTime,
            close: openTime + (duration.seconds(30)), //will end 30 sec later
            cap: ether(300), //max ether allowed to receive
            rate: new web3.BigNumber(5), // ether to token ratio
            bonusRate: new web3.BigNumber(0.5), //bonus rate percentage 50%
            minWei: ether(1), //minimum investment
            walletEth: accounts[0],
            token: meta.po8Token.address,
            walletToken: accounts[0],
            tx_options: {
                from: accounts[0],
                gas: 500000000
            }
        }
    };


    deployer.deploy(
        PrivateSale,
        config.privateSale.open,
        config.privateSale.close,
        config.privateSale.cap,
        config.privateSale.rate,
        config.privateSale.bonusRate,
        config.privateSale.minWei,
        config.privateSale.walletEth,
        config.privateSale.token,
        config.privateSale.walletToken,
        config.privateSale.tx_options
    ).then(function(){
        console.log(PrivateSale);
    });
};