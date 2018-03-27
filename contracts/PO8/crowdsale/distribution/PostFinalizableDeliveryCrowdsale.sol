pragma solidity ^0.4.18;
//author Rolf Bansbach

import "../../zlib/crowdsale/distribution/PostDeliveryCrowdsale.sol";
import "../../zlib/crowdsale/distribution/FinalizableCrowdsale.sol";

//it allows widrawal of tokens after is finalized
contract PostFinalizableDeliveryCrowdsale is PostDeliveryCrowdsale, FinalizableCrowdsale
{
    /**
   * @dev Withdraw tokens only after crowdsale ends and is final
   */
    function withdrawTokens() public {
        require(hasClosed());
        require(isFinalized);
        uint256 amount = balances[msg.sender];
        require(amount > 0);
        balances[msg.sender] = 0;
        _deliverTokens(msg.sender, amount);
    }
}
