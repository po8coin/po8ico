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
    let bonusRate = new web3.BigNumber(50);
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
    var normalAmount = ether(2).toNumber() * rate.toNumber();
    var bonusAmount = (normalAmount / 100) * bonusRate.toNumber();
    var totalWithBonus = normalAmount + bonusAmount;

    it("event purchase 1 correct amount", () =>{
        assert.web3Event( resultPurchase,
            {
                event:'TokenPurchase',
                "args": {
                    "amount": totalWithBonus,
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
        normalAmount = ether(2).toNumber() * 8;
        bonusAmount = (normalAmount / 100) * bonusRate.toNumber();
        totalWithBonus = normalAmount + bonusAmount;
        assert.web3Event( resultPurchase,
            {
                event:'TokenPurchase',
                "args": {
                    "amount": totalWithBonus,
                    "beneficiary": accounts[1],
                    "purchaser": accounts[1],
                    "value": ether(2).toNumber()
                }
            }
        );
    });

    it("update cap amount", async () =>{
        await  privateSaleInstance.setCapAmount(ether(1), {
            from: accounts[0],
            gas: 500000000
        });
    });

    it("cannot buy more than the cap",  async()=>{
        let error = false;
        try {
            resultPurchase = await privateSaleInstance.buyTokens
            (
                accounts[1],
                {
                    from: accounts[1],
                    value: ether(2),
                    gas: 500000000
                }
            );
            error = true;
        } catch (e) {
            error = false;
        }

        if(error) {
            assert.equal(true, false, 'ERROR: user was able to purchase');
        } else {
            assert.equal(true, true, 'you should never read this.');
        }

    }).timeout(timeoutMs + 50000);



    var startingBalance;
    it("user balance is 0", async()=>{
        startingBalance = await po8Instance.balanceOf(accounts[1]);
        assert.equal(startingBalance.toString(), '0', 'balance is incorrect');
    });


    it("set percentage to withdraw to 20", async()=>{
        await privateSaleInstance.setAllowedPercent(
            20,
            {
                from: accounts[0],
                gas: 500000000
            }
        );
    });

    var resultWthdraw;
    var totalAmount = (ether(2).toNumber() * rate.toNumber()) + (ether(2).toNumber() * 8);
    var totalBonus = (totalAmount / 100) * bonusRate.toNumber();
    var shouldbe1Percent = (totalAmount + totalBonus) / 100;
    it("can withdraw 20% tokens after sale is done and finalized", (done)=>{
        var callbackWithdraw = async()=>{

            console.log('finalize private sale');
            await privateSaleInstance.finalize({from:accounts[0], gas: 500000000 });

            console.log("trigger withdraw of tokens after sale is over");
            resultWthdraw = await privateSaleInstance.withdrawTokens({
                from: accounts[1],
                gas: 500000000
            });
            let balance = await po8Instance.balanceOf(accounts[1]);
            let shouldbe = shouldbe1Percent * 20;
            assert.equal(balance.toNumber(), shouldbe, "balance is incorrect");
            done();
        };

        setTimeout(callbackWithdraw, 30000);

    }).timeout(timeoutMs + 50000);

    it("set percentage to withdraw to 40", async()=>{
        await privateSaleInstance.setAllowedPercent(
            40,
            {
                from: accounts[0],
                gas: 500000000
            }
        );
    });

    it("can withdraw another 20%", async()=>{
        resultWthdraw = await privateSaleInstance.withdrawTokens({
            from: accounts[1],
            gas: 500000000
        });
        let balance = await po8Instance.balanceOf(accounts[1]);
        let shouldbe = shouldbe1Percent * 40;
        assert.equal(balance.toNumber(), shouldbe, "balance is incorrect");
    });

    it("set percentage to withdraw to 100", async()=>{
        await privateSaleInstance.setAllowedPercent(
            100, {
                from: accounts[0],
                gas: 500000000
            }
        );
    });

    it("can withdraw the remaining 60%", async()=>{
        resultWthdraw = await privateSaleInstance.withdrawTokens({
            from: accounts[1],
            gas: 500000000
        });
        let balance = await po8Instance.balanceOf(accounts[1]);
        let shouldbe = shouldbe1Percent * 100;
        assert.equal(balance.toNumber(), shouldbe, "balance is incorrect");
    });

    it("cannot withdraw more funds", async()=> {
        let error = false;
        let balance;
        try{
            resultWthdraw = await privateSaleInstance.withdrawTokens({
                 from: accounts[1],
                gas: 500000000
            });
            balance = await po8Instance.balanceOf(accounts[1]);
            error = true;
        } catch (e) {
            error = false;
        }
        if(error) {
            assert.equal(true, false, "Error: the user should not be able to withdraw more, new balance "+balance.toNumber());
        } else {
            assert.equal(true, true, "yey!");
        }

    });

    it("wait 5 seconds to request balance", (done)=>{

        var checkBalanceDelayed = async function() {
            let balance = await po8Instance.balanceOf(accounts[1]);
            console.log("final balance is = " + balance.toNumber());
            done();
        };

        setTimeout(checkBalanceDelayed, 5000);


    }).timeout(10000);



});
