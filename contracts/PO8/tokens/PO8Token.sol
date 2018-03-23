pragma solidity ^0.4.18;

import "../zlib/token/ERC20/StandardToken.sol";
import "../zlib/token/ERC20/MintableToken.sol";


contract PO8Token is StandardToken, MintableToken {

    string public constant name = "Pieces of 8";
    string public constant symbol = "PO8";
    uint8 public constant decimals = 18;

    //initial supply 10 billion
    uint256 public constant INITIAL_SUPPLY = 10000000000 * (10 ** uint256(decimals));


    function PO8Token(address owner) public {

        //give all tokens to the creator of the contract
        totalSupply_ = INITIAL_SUPPLY;
        balances[owner] = INITIAL_SUPPLY;
        Transfer(0x0, owner, INITIAL_SUPPLY);
    }

}
