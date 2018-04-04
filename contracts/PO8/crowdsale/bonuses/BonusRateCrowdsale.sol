pragma solidity ^0.4.18;

import '../../zlib/crowdsale/Crowdsale.sol';
import '../../zlib/ownership/Ownable.sol';

contract BonusRateCrowdsale is Crowdsale, Ownable
{
    uint256 public bonus_rate = 0;

    function BonusRateCrowdsale(uint256 _bonus_rate)
    {
        bonus_rate = _bonus_rate;
    }

    function setBonusRate(uint256 _rate)  external onlyOwner {
        bonus_rate = _rate;
    }

    /**
   * @dev converts to token amount plus bonus amount, overrides parent
   * @param _weiAmount Value in wei to be converted into tokens
   * @return Number of tokens that can be purchased with the specified _weiAmount
   */
    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        uint256 normalAmount = _weiAmount * rate;
        uint256 bonusAmount = normalAmount * bonus_rate;
        return normalAmount + bonusAmount;
    }
}
