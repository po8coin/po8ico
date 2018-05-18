var Web3 = require("web3");
var HDwalletPrivateKeyProvider = require("truffle-hdwallet-provider-privkey");
var args = require("./myargs").args;
var config = require("./config");

var validNetworks = ['local', 'ropsten', 'mainnet', "rinkeby", "rinkeby_original"];
if(validNetworks.indexOf(args.network) < 0) {
    console.log("network option invalid");
    process.exit(1);
}

var web3 = [];
var configme;


var networks = ["local", "ropsten", "mainnet", "rinkeby", "rinkeby_original"];
if(networks.indexOf(args.network) < 0) {
    console.log("Invalid Network: " + args.network);
    process.exit(2);
}

configme = config.networks[args.network];



function getNetworkString(network) {
    if(network === 'local') {
        var n = configme.network;
        return n.host + (n.port ? ":" + n.port : '');
    } else  {
        var n = configme.network;
        return n.host + (n.port ? ":" + n.port : '') + '/' + config.infurakey;
    }
}


function getWeb3 (wallet) {
    console.log("get web 3");
    if(parseInt(wallet) >= 0 && configme) {
        var w = configme.wallets[wallet];
        if(w) {
            var networkString = getNetworkString(args.network);
            console.log("Network String: " + networkString);
            console.log(w.priv_key);
            var hdwallet = new HDwalletPrivateKeyProvider(w.priv_key, networkString);
            //return new Web3(new Web3.providers.HttpProvider(networkString));
            return new Web3(hdwallet.engine);
        } else {
            console.log("Wallet not found in config. " + wallet.toString());
            process.exit(2);
        }
    }
}

module.exports = {
    web3: getWeb3,
    config: configme
};

/*var w = new HDwalletPrivateKeyProvider(config.networks.local.admin_wallet.priv_key, config.networks.local.network.);
var web3 = new Web3(w.engine);*/

