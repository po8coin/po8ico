var po8Token = artifacts.require("./PO8/tokens/PO8Token.sol");

contract('PO8Token', function(accounts) {

    var po8Instance;
    var allTokens = new web3.BigNumber('10000000000000000000000000000');
    var onePO8 = new web3.BigNumber('1000000000000000000');

    it("Get contract instance", function(){
        return po8Token.deployed().then(function(instance){
            po8Instance = instance;
            assert.equal(true, true, "unable to get contract instance.");
        });
    });

    it("Owner should have all the tokens", function() {
        return po8Instance.balanceOf(accounts[0]).then(function(balance){
            assert.equal(balance.toString(), allTokens.toString(), "owner doesnt have all the tokens!.");
        });
    });

    it("Can transfer PO8 tokens from owner to another address", function() {
        return po8Instance.transfer(accounts[1], onePO8).then(function (success) {
            assert.equal(success.logs[0].event, 'Transfer', "...transfer failed");
        });
    });

    it("Account 1 has correct amount of tokens.", function(){
        return po8Instance.balanceOf(accounts[1]).then(function(balance){
            assert.equal(balance.toString(), onePO8.toString(), "accounts[1] does not have the correct amount of PO8.");
        });
    });

    it("Owner should be able to mint tokens and transfer them to account[2]", function(){
        return po8Instance.mint(accounts[2], onePO8).then(function(result){
            return po8Instance.balanceOf(accounts[2]);
        }).then(function(balance){
            assert.equal(balance.toString(), onePO8.toString(), "Tokens were not minted.");
        });
    });

    it("Only Owner can mint.", function () {
        po8Instance.constructor.defaults({from: accounts[1]});
        return po8Instance.mint(accounts[2], onePO8).then(function(result){
            assert.equal(true, false, "tokens were MINTED! Security error.");
        }).catch(function(error){
            assert.equal(true, true, "..." + error.toString());
        });
        po8Instance.constructor.defaults({from: accounts[0]});
    });

    it("Cannot claim tokens without approval.", function(){
        po8Instance.constructor.defaults({from: accounts[1]});
        return po8Instance.transferFrom(accounts[0], accounts[1], onePO8).then(function (result) {
            assert(true, false, " WOA, this should not have been happened, someone transfered funds without approval.");
        }).catch(function (error) {
            assert(true, true, "..." + error.toString());
        });
        po8Instance.constructor.defaults({from: accounts[0]});
    });

    it("Can claim tokens WITH approval.", function () {
        po8Instance.constructor.defaults({from: accounts[0]});
        return po8Instance.approve(accounts[1], onePO8).then(function (result) {
            //change who is originating the transferFrom call
            po8Instance.constructor.defaults({from: accounts[1]});
            return po8Instance.transferFrom(accounts[0], accounts[1], onePO8);
        }).then(function (result) {
            assert.equal(result.logs[0].event, 'Transfer');
        });
    });

    /*it("Cannot claim tokens TWICE", function () {

    });*/

});
