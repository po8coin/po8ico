require('babel-register')({
    ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = require('./metamask.mnemonic');



module.exports = {

    networks: {

        /*local dev*/
        dev: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "5777"
        },
        /*ganache cli*/
        dev2: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },

        ropsten:{
            provider: function() {
              return new HDWalletProvider(mnemonic.code,"https://ropsten.infura.io/" + mnemonic.infurakey);
            },
            network_id: 3,
            gas: 500000

        }

        /*other*/

    }

};

/*

Available Accounts
==================
(0) 0x24769b6962156b3f606e3bec37e837cae51ce43d
(1) 0xfba1981203e62a35e7ef895723439d18bce0e5b7
(2) 0xeaeab2c10fae3a38b9aff46dcbc10afce2a6eeda
(3) 0xf07710445d49207fcc7cbe0a5bf84e971e6ca71b
(4) 0xbba8363253e7fd57f0e80f1f16f5d1913757d09b
(5) 0x9ddba85e7bb1e85381a1fbcc16628a5735535911
(6) 0xfcb0c5fa8c286df6e4d066fcf01802c1ebe9f99c
(7) 0x1944165af30e92b86589c4940d6627cadd6dbb16
(8) 0x23475eb4a7aefdd125f2e773b947b82936a54a1e
(9) 0x7314b1724449f46fc4253c2261918f2c21e2425b

Private Keys
==================
(0) 904ab47b32d1ff6ab1cf536f67635e581a329ab2a26ac24ebd71023e64d04670
(1) 387b283b5e3b07b190c5fd31038cce051fb741d7cbdeb044a412a41bd102bb6d
(2) 35c51ffbd3633396cc691c8cba2668f47792d59777d34950e30dcd44764cae64
(3) 6c6aea4a11392894c19d935f6169dafd3a5247a599a2bb7045dbfe90de3b2c1e
(4) 17a15c4778351558bb39d724815c143ba1123f35abdb1c2b9a301f0ba28e8281
(5) 2e501c4c6e0dcb8166b16af2b564678d84539f94729eaa7cdf265b48c068224e
(6) 1d78e9a20bfafa15073809dd9b6476add6a1322076e3fd47cefd02abc6cfda3c
(7) e637020e156401b657c5f967f428f8dc8b1b168ca1ed59f9b8970c266e248d0d
(8) cf91719aac9b3d84652573e0c0521ceacf853fde2e2ddd2fcd6873b6167e1783
(9) 7abcee8b25ef70ce8045eee70970b8bb8cad12953c22f0f6ce2e4f91d623e17f


 */
