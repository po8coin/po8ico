pragma solidity ^0.4.18;

import "./PostFinalizableDeliveryCrowdsale.sol";
import "../../zlib/ownership/Ownable.sol";
import "../../zlib/math/SafeMath.sol";

contract ReleasablePercentage is PostFinalizableDeliveryCrowdsale, Ownable {

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
        uint256 balanceAmount = balances[msg.sender];
        require(balanceAmount > 0);
        uint256 withdrawn = withdrawnBalance[msg.sender];
        uint256 totalTokens = balanceAmount + withdrawn;
        uint256 totalAllowance = (totalTokens / 100) * allowedPercent;
        uint256 allowedAmount = totalAllowance - withdrawn;
        require(allowedAmount > 0);
        require(allowedAmount <= balanceAmount);
        withdrawnBalance[msg.sender] = withdrawn + allowedAmount;
        balances[msg.sender] = balanceAmount - totalAllowance;
        _deliverTokens(msg.sender, allowedAmount);
    }
}
