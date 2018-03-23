pragma solidity ^0.4.18;

import '../../zlib/crowdsale/Crowdsale.sol';

contract BonusRateCrowdsale is Crowdsale
{
    uint256 bonus_rate = 0;

    function BonusCrowdsale(uint256 _bonus_rate)
    {
        bonus_rate = _bonus_rate;
    }

    function setBonusRate(uint256 _rate) onlyOwner external {
        bonus_rate = _rate;
    }

    /**
   * @dev converts to token amount plus bonus amount, overrides parent
   * @param _weiAmount Value in wei to be converted into tokens
   * @return Number of tokens that can be purchased with the specified _weiAmount
   */
    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        uint256 normalAmount = _weiAmount.mul(rate);
        uint256 bonusAmount = normalAmount.mul(bonus_rate);
        return normalAmount.sum(bonusAmount);
    }
}
