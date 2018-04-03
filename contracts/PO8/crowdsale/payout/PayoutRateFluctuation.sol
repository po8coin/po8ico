pragma solidity ^0.4.18;

import '../../zlib/crowdsale/Crowdsale.sol';
import '../../zlib/ownership/Ownable.sol';

contract PayoutRateFluctuation is Crowdsale, Ownable {
    /**
    *API to update payout rate per wei
    */
    function setPayoutRate(uint256 _new_rate)  external onlyOwner {
        require(_new_rate >= 1);
        rate = _new_rate;
    }
}
