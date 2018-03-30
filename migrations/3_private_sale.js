var PrivateSale = artifacts.require("./PO8/crowdsale/PrivateSale.sol");
var meta = require('../migrations/meta/meta');

module.exports = function(deployer, network, accounts) {


    /*PO8 Private Sale*/

    var openTime =  Date.now() + 3;//the private sale will start in 3 seconds after deployed
    var config = {
        token: {
            address: meta.po8Token.address
        },
        privateSale: {
            open: openTime,
            close: openTime + 30, //will end 30 sec later
            cap: '500000000000000000000', //max ether allowed to receive 500
            rate: 5, // ether to token ratio
            bonusRate: 0.5, //bonus rate percentage 50%
            minWei: '1000000000000000000', //minimum investment 1 ether
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
        //set up token allowance

    });
};