# po8ico Smart Contract API:

## PO8Token.sol

1. Construct params:
 - address owner: assigns all tokens to this wallet address on deployment.
2. Standard API:
 - transfer(address _to, uint256 _value).
 - balanceOf(address _owner).
 - totalSupply().
 - transferFrom(address _from, address _to, uint256 _value).
 - approve(address _spender, uint256 _value).
 - allowance(address _owner, address _spender).
 - increaseApproval(address _spender, uint _addedValue).
 - decreaseApproval(address _spender, uint _subtractedValue).
 - mint(address _to, uint256 _amount) onlyOwner.
 - finishMinting() onlyOwner.

>Note: The contract is hardcoded to start with an initial supply of 10 billion tokens, however the owner can also mint new tokens if necessary.

## PrivateSale.sol
