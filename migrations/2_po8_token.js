var PO8Token = artifacts.require("./PO8/tokens/PO8Token.sol");
var fs = require('fs-extra');

module.exports = function(deployer, network, accounts) {
    /*PO8 Token*/
    deployer.deploy(PO8Token, accounts[0]).then(function(){
        /*save token address for private sale migration*/
        fs.writeFileSync(
            __dirname + '/meta/meta.json',
            JSON.stringify(
                {
                    po8Token: {
                        address: PO8Token.address
                    }
                },
                null,
                2
            )
        );
    });
};
