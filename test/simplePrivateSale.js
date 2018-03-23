require('truffle-test-utils').init();
var po8Token = artifacts.require("./PO8/tokens/PO8Token.sol");
var privateSale = artifacts.require("./PO8/crowdsale/PrivateSaleSimple.sol");

import ether from './helpers/ether';
import {duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';



contract('PrivateSale', function(accounts) {

    var po8Instance;
    var privateSaleInstance;
    var allTokens = new web3.BigNumber('1000000000000000000000000000');
    var onePO8 = new web3.BigNumber('1000000000000000000');


    let open = latestTime();
    let close = open + (duration.days(1));
    let cap = ether(100000);
    let rate = new web3.BigNumber(10);
    let wallet = accounts[0];


    beforeEach('set up contract instances', async()=>{
        po8Instance = await po8Token.new(
            accounts[0],
            {
                from:accounts[0],
                gas: 5000000
            }
        );
        privateSaleInstance = await privateSale.new(
            rate,
            wallet,
            po8Instance.address,
            accounts[0],
            {
                from:accounts[0],
                gas: 50000000
            }
        );
        console.log("po8Token address: " + po8Instance.address);
        console.log("privateSale address: " + privateSaleInstance.address);
        let response = await po8Instance.approve(
            privateSaleInstance.address,
            onePO8.mul(30000000)
        );

    });

    it("Get Rolf", async()=>{
        let result = await privateSaleInstance.getRolf().then((response)=>{
            assert.equal(true, true, "");
        });
        return result;
    });

    it("Allows buying tokens", async()=>{
        let buyToken1 =  await privateSaleInstance
        .buyTokens
        (
            accounts[1],
            {
                from: accounts[1],
                value: ether(10),
                gas: 500000000
            }
        );


        expect.web3Event(buyToken1,
            {
                event: 'TokenPurchase',
                args:{
                    "amount": 100000000000000000000,
                    "beneficiary": "0xf17f52151ebef6c7334fad080c5704d77216b732",
                    "purchaser": "0xf17f52151ebef6c7334fad080c5704d77216b732",
                    "value": 10000000000000000000
                }
            },
            "Hola Rolf was emitted"
        );

        return buyToken1;
    });




});
