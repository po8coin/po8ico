var privateSale = artifacts.require("./PO8/crowdsale/PrivateSaleSimple.sol");
var PO8Token = artifacts.require("./PO8/tokens/PO8Token.sol");
var duration =  require("../test/helpers/increaseTime.js").duration;
var latestTime = require("../test/helpers/latestTime.js");
var ether = require("../test/helpers/ether.js");



module.exports = async function(deployer, network, accounts) {

    var rate = new web3.BigNumber(10);
    var wallet = accounts[0];
    /*PO8 Token*/
    var po8Instance;
    PO8Token.deployed().then(function(instance){
         po8Instance = instance;
         deployer.deploy(
             privateSale,
             rate,
             wallet,
             po8Instance.address,
             accounts[0]
         );
    });



};
/*
var PO8Instance;
    var allTokens = new web3.BigNumber('1000000000000000000000000000');
    var onePO8 = new web3.BigNumber('1000000000000000000');


    let open = latestTime();
    let close = open + (duration.days(1));
    let cap = ether(100000);
    let rate = new web3.BigNumber(10);
    let wallet = accounts[0];

    PO8Token.deployed().then(function(instance){
        PO8Instance = instance;
        deployer.deploy(
            privateSale,
            rate,
            wallet,
            PO8Instance.address,
            accounts[0],
            {
                from: accounts[0],
                gas: 50000000
            }
        );
    });
 */