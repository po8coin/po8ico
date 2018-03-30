var BigNumber = require('bignumber.js').BigNumber;

function ether(val) {
    var number = new BigNumber(val);
    var result = number.multipliedBy(1000000000000);
    return result.toString();
}

module.exports = {
    ether: ether
};