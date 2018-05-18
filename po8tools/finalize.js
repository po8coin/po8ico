var w = require("./getWeb3");
var psAbi = require("./PrivateSale").abi;
var args = require("./myargs").args;

/**
 * finish token sale
 */

//web3 and config
var web3 = w.web3(0);//connect as admin
var config = w.config;

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


console.log("finalizing sale, non revertible");
privateSale.finalize(config.tx_options, function(err, res) {
    if(err) {
        console.log(err);
        process.exit(5);
    }
    console.log(res);
    console.log("Done.");
    process.exit(0);
} );

