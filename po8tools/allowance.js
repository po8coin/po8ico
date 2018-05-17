var w = require("./getWeb3");
var psAbi = require("./PrivateSale").abi;
var po8Abi = require("./PO8Token").abi;
var args = require("./myargs").args;

/**
 * Set an allowance of X po8 tokens
 */

//web3 and config
var web3 = w.web3(0); //conecting with admin wallet
var config = w.config;
//utils
var BN = web3.BigNumber;
var onePo8 = new BN('1000000000000000000', 10);

//get token instance
var po8TokenContract = web3.eth.contract(po8Abi);
var po8Token = po8TokenContract.at(config.token_address);

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

//set allowance
if(args.allowance && parseInt(args.allowance) > 0) {
    var allowance = onePo8.mul(new BN(args.allowance, 10));
    console.log("Allowance = " + allowance.toString(10));

     po8Token.approve(
        privateSale.address,
        allowance.toString(10),
        config.tx_options,
        function(err, res) {
            if(err) {
                console.log(err);
                process.exit(5);
            }
            console.log(res);
            console.log("Done.");
            process.exit(0);
        }
    );


    //process.exit(5);

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
    console.log("allowance not specified");
    process.exit(2);
}




