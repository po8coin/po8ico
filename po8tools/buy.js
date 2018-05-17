var w = require("./getWeb3");
var psAbi = require("./PrivateSaleFlat").abi;
var args = require("./myargs").args;

/**
 * Buy some tokens from another address
 */

//web3 and config
var web3 = w.web3(2);//connect as secondary
var config = w.config;
//utils
var BN = web3.BigNumber;
var onePo8 = new BN('1000000000000000000', 10);

//determine which sale contract to use
var sale;
if(args.sale) {
    sale = config[args.sale];
    if (!sale) {
        console.log("Sale does not exist.");
        process.exit(2);
    }
} else {
    sale = config.private_sale1;
}
var privateSaleContract = web3.eth.contract(psAbi);
var privateSale = privateSaleContract.at(sale.address);

console.log("buying some tokens from: " + config.wallets[2].address);
/*var statusEvent = privateSale.TimeCrowdsaleStatus();

statusEvent.watch(function(error, result) {
    console.log("event");
    if(!error) {

        console.log(result);
        console.log("event restult");
    } else {
        console.log(error);
        console.log("error");
    }
});*/
privateSale.buyTokens(
    config.wallets[2].address,
    {
        from: config.wallets[2].address,
        value: "50000000000000000000",
        gas: 500000000
    },
    function(err, res) {
        if (err) {
            console.log(err);
            console.log("Error.");
            process.exit(5);
        }
        console.log(res);
        console.log("Done");
        process.exit(0);
    }
);




