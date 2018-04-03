require('truffle-test-utils').init();
var po8Token = artifacts.require("./PO8/tokens/PO8Token.sol");
var privateSale = artifacts.require("./PO8/crowdsale/PrivateSale.sol");

import ether from './helpers/ether';
import {duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';

const {promisify} = require('util');
const sleep = promisify(setTimeout);

contract('PrivateSale', function(accounts) {

    var po8Instance;
    var privateSaleInstance;
    var allTokens = new web3.BigNumber('1000000000000000000000000000');
    var onePO8 = new web3.BigNumber('1000000000000000000');

    let timeout = 3;
    let timeoutMs = timeout * 1000;
    let open = latestTime() + timeout;
    let close = open + (duration.seconds(30));
    let cap = ether(300);
    let rate = new web3.BigNumber(5);
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

    var resultPurchase;
    it("whitelist address CAN buy tokens",  (done)=>{
         var callbackPurchase = async () => {
             console.log('starting buy transaction');
             resultPurchase = await privateSaleInstance.buyTokens
             (
                 accounts[1],
                 {
                     from: accounts[1],
                     value: ether(2),
                     gas: 500000000
                 }
             );
             done();
         };
         setTimeout(callbackPurchase, timeoutMs);
        //assert.equal(true, false, 'failing on purpose');
    }).timeout(timeoutMs + 50000);

    it("event purchase 1 correct amount", () =>{
        assert.web3Event( resultPurchase,
            {
                event:'TokenPurchase',
                "args": {
                    "amount": ether(2).toNumber() * rate.toNumber(),
                    "beneficiary": accounts[1],
                    "purchaser": accounts[1],
                    "value": ether(2).toNumber()
                }
            }
        );
    });

    it("change payout rate", async () => {
        await  privateSaleInstance.setPayoutRate(8, {
            from: accounts[0],
            gas: 500000000
        });
    });

    it("make second purchase to new rate",  (done)=>{
        var callbackPurchase = async () => {
            console.log('starting buy transaction');
            resultPurchase = await privateSaleInstance.buyTokens
            (
                accounts[1],
                {
                    from: accounts[1],
                    value: ether(2),
                    gas: 500000000
                }
            );
            done();
        };
        setTimeout(callbackPurchase, timeoutMs);
    }).timeout(timeoutMs + 50000);

    it("event purchase 2 correct amount", () =>{
        assert.web3Event( resultPurchase,
            {
                event:'TokenPurchase',
                "args": {
                    "amount": ether(2).toNumber() * 8,
                    "beneficiary": accounts[1],
                    "purchaser": accounts[1],
                    "value": ether(2).toNumber()
                }
            }
        );
    });

    var startingBalance;
    it("user balance is 0", async()=>{
        startingBalance = await po8Instance.balanceOf(accounts[1]);
        assert.equal(startingBalance.toString(), '0', 'balance is incorrect');
    });

    var resultWthdraw;
    it("can withdraw tokens after sale is done", (done)=>{
        var callbackWithdraw = async()=>{

            console.log('finalize private sale');
            await privateSaleInstance.finalize({from:accounts[0], gas: 500000000 });

            console.log("trigger withdraw of tokens after sale is over");
            resultWthdraw = await privateSaleInstance.withdrawTokens({
                from: accounts[1],
                gas: 500000000
            });
            let balance = await po8Instance.balanceOf(accounts[1]);
            assert.equal(balance, (ether(2).toNumber() * rate.toNumber()) + (ether(2).toNumber() * 8), "balance is incorrect");
            done();
        };

        setTimeout(callbackWithdraw, 50000);

    }).timeout(timeoutMs + 50000);

});
