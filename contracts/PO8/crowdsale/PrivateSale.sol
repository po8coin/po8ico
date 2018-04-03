pragma solidity ^0.4.18;

import "../zlib/token/ERC20/ERC20.sol";
import "../zlib/crowdsale/Crowdsale.sol";
import "../zlib/crowdsale/validation/WhitelistedCrowdsale.sol";
import "../zlib/crowdsale/validation/CappedCrowdsale.sol";
import "../zlib/crowdsale/emission/AllowanceCrowdsale.sol";
import "../zlib/crowdsale/validation/TimedCrowdsale.sol";
import "./distribution/PostFinalizableDeliveryCrowdsale.sol";
import "./validation/MinimumRequired.sol";
import "./bonuses/BonusRateCrowdsale.sol";
import "./payout/PayoutRateFluctuation.sol";

contract PrivateSale is
        AllowanceCrowdsale,
        CappedCrowdsale,
        WhitelistedCrowdsale,
        PostFinalizableDeliveryCrowdsale,
        MinimumRequired,
        BonusRateCrowdsale,
        PayoutRateFluctuation
{
    //constructor
    function PrivateSale(
        uint256 _open,
        uint256 _close,
        uint256 _cap ,
        uint256 _rate,
        uint256 _bonus_rate,
        uint256 _minWei,
        address _wallet,
        ERC20 _token,
        ERC20 _tokenWallet
    ) public
        Crowdsale (_rate, _wallet, _token)
        TimedCrowdsale(_open, _close)
        CappedCrowdsale (_cap)
        AllowanceCrowdsale (_tokenWallet)
        MinimumRequired (_minWei)
        BonusRateCrowdsale (_bonus_rate)
    {

    }

}
