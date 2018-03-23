require('truffle-test-utils').init();
var po8Token = artifacts.require("./PO8/tokens/PO8Token.sol");
var privateSale = artifacts.require("./PO8/crowdsale/PrivateSale.sol");

import ether from './helpers/ether';
import {duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';



contract('PrivateSale', function(accounts) {

    var po8Instance;
    var privateSaleInstance;
    var allTokens = new web3.BigNumber('1000000000000000000000000000');
    var onePO8 = new web3.BigNumber('1000000000000000000');

    let timeout = 3;
    let open = latestTime() + timeout;
    let close = open + (duration.days(30));
    let cap = ether(300);
    let rate = new web3.BigNumber(10);
    let bonusRate = new web3.BigNumber(0.5);
    let minWei = ether(1);
    let wallet = accounts[0];



    it('set up token contract', async()=>{
        po8Instance = await po8Token.new(
            accounts[0],
            {
                from:accounts[0],
                gas: 5000000
            }
        );
        console.log("po8Token address: " + po8Instance.address);
        return po8Instance;
    });

    it("set up private sale instance",  async()=>{
        privateSaleInstance = await privateSale.new(
            open,
            close,
            cap,
            rate,
            bonusRate,
            minWei,
            wallet,
            po8Instance.address,
            accounts[0],
            {
                from:accounts[0],
                gas: 500000000
            }
        );
        console.log("privateSale address: " + privateSaleInstance.address);
        return privateSaleInstance;
    });

    it("set up allowance to private sale", async()=>{
        let response = await po8Instance.approve(
            privateSaleInstance.address,
            onePO8.mul(30000000)
        );
        return response;
    });


    it("set up whitelisted address", async()=>{
        return await privateSaleInstance.addToWhitelist(
            accounts[1],
            {
                from:accounts[0],
                gas: 500000000
            }
        );
    });

    it("whitelist address CAN buy tokens", async()=>{

        return await privateSaleInstance.buyTokens
        (
            accounts[1],
            {
                from: accounts[1],
                value: ether(5),
                gas: 500000000
            }
        );
    });


   /*it("Allows buying tokens", async()=>{
        let buyToken1 =  await privateSaleInstance
        .buyTokens
        (
            accounts[1],
            {
                from: accounts[1],
                value: ether(1),
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
            "token purchase success"
        );

        return buyToken1;
    });*/




});
