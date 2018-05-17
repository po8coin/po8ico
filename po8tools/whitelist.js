var w = require("./getWeb3");
var psAbi = require("./PrivateSale").abi;
var args = require("./myargs").args;

/**
 * Add address to whitelist
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


//add address to whitelist
if(args.whitelist && web3.isAddress(args.whitelist)) {
    var address = args.whitelist;
    console.log("Adding address: " + address + " to whitelisted investors.");
    privateSale.addToWhitelist(address, config.tx_options, function(err, res) {
        if(err) {
            console.log(err);
            process.exit(5);
        }
        console.log(res);
        console.log("Done.");
        process.exit(0);
    } );
    /*tx.on("transactionHash", function(receipt) {
        //console.log(receipt);
        console.log("transactionHash.")
        console.log("Receipt: ", receipt);
    }).on("error", function (error) {
        console.log(error);
        console.log("Error.")
    }).on("confirmation", function (confNumber, receipt) {
        //console.log(confNumber, receipt);
        console.log("Confirmation.", confNumber);
    });*/
} else {
    console.log("Whitelist address is invalid.");
    process.exit(2);
}
