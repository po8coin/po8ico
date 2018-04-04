pragma solidity ^0.4.18;

import "../../zlib/crowdsale/distribution/PostDeliveryCrowdsale.sol";
import "../../zlib/crowdsale/distribution/FinalizableCrowdsale.sol";
import "../../zlib/ownership/Ownable.sol";
import "../../zlib/math/SafeMath.sol";

contract ReleasablePercentage is Ownable, PostDeliveryCrowdsale, FinalizableCrowdsale {

    using SafeMath for uint256;

    /**
    *cannot be greater than 100
    */
    uint256 public allowedPercent = 0;

    /**
    *keep track of withdrawn tokens
    */
    mapping(address => uint256) public withdrawnBalance;

    /**
    *API to set the allowed global percentage to be withdrawn
    */
    function setAllowedPercent(uint256 _new_percent)  external onlyOwner {
        require(_new_percent <= 100);
        require(_new_percent >= 0);
        allowedPercent = _new_percent;
    }

    /**
    *
    */

    /**
   * @dev Withdraw allowed percentage of tokens only after crowdsale ends and is final
   */
    function withdrawTokens() public {
        require(hasClosed());
        require(isFinalized);

        uint256 balanceLeft = balances[msg.sender];
        uint256 withdrawn = withdrawnBalance[msg.sender];
        uint256 totalTokens = balanceLeft + withdrawn;
        uint256 totalAllowance = (totalTokens / 100) * allowedPercent;
        uint256 allowedAmount = totalAllowance - withdrawn;

        require(balanceLeft > 0);
        require(allowedAmount > 0);
        require(allowedAmount <= balanceLeft);
        withdrawnBalance[msg.sender] = allowedAmount + withdrawn;
        balances[msg.sender] = balanceLeft - allowedAmount;
        _deliverTokens(msg.sender, allowedAmount);
    }
}
