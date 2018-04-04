pragma solidity ^0.4.18;

import "../../zlib/crowdsale/validation/CappedCrowdsale.sol";
import "../../zlib/ownership/Ownable.sol";

contract SetCap is CappedCrowdsale, Ownable {

    /**
    *API to set mininum investment only owner of contract
    */
    function setCapAmount(uint256 _new_cap)  external onlyOwner {
        cap = _new_cap;
    }
}
