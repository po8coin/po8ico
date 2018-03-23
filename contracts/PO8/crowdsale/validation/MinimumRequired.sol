pragma solidity ^0.4.18;

import "../../zlib/crowdsale/Crowdsale.sol";
import "../../zlib/ownership/Ownable.sol";

contract MinimumRequired is Crowdsale, Ownable
{

    uint256 minInvestmentWei =  0;//allow any default

    function MinimumRequired(uint256 _minWei) public {
        minInvestmentWei = _minWei;
    }

    modifier isMinMet(uint256 _amount) {
        require(_amount >= minInvestmentWei);
        _;
    }

    /**
    *API to set mininum investment only owner of contract
    */
    function setMinInvestment(uint256 _minWei) onlyOwner external {
        minInvestmentWei = _minWei;
    }

    /**
   * @dev Extend parent behavior requiring minimum invest of x Wei.
   * @param _beneficiary Token beneficiary
   * @param _weiAmount Amount of wei contributed
   */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal isMinMet(_weiAmount) {
        super._preValidatePurchase(_beneficiary, _weiAmount);
    }


}
