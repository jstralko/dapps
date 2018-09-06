pragma solidity ^0.4.24;

import "./PricingStrategies.sol";
import "./FundingStrategies.sol";

contract UnlimitedFixedPricingCrowdsale is FixedPricingCrowdsale {

    function UnlimitedFixedPricingCrowdsale (uint256 _startTime, uint256 _endTime,
       uint256 _weiTokenPrice, uint256 _etherInvestmentObjective)
       FixedPricingCrowdsale(_startTime, _endTime, //
       _weiTokenPrice, _etherInvestmentObjective)
       payable public  {
    }

    function createFundingLimitStrategy()
        internal returns (FundingLimitStrategy) {

        return new UnlimitedFundingStrategy(); //
    }
}

contract CappedFixedPricingCrowdsale  is FixedPricingCrowdsale {

    function CappedFixedPricingCrowdsale(uint256 _startTime, uint256 _endTime,
       uint256 _weiTokenPrice, uint256 _etherInvestmentObjective)
       FixedPricingCrowdsale(_startTime, _endTime, //
       _weiTokenPrice, _etherInvestmentObjective)
       payable public  {
    }

    function createFundingLimitStrategy()
        internal returns (FundingLimitStrategy) {

        return new CappedFundingStrategy(10000);
    }
}

contract UnlimitedTranchePricingCrowdsale is TranchePricingCrowdsale {

    function UnlimitedTranchePricingCrowdsale (uint256 _startTime, uint256 _endTime,
       uint256 _etherInvestmentObjective)
       TranchePricingCrowdsale(_startTime, _endTime,
       _etherInvestmentObjective)
       payable public  {
    }

    function createFundingLimitStrategy()
        internal returns (FundingLimitStrategy) {

        return new UnlimitedFundingStrategy();
    }
}

contract CappedTranchePricingCrowdsale is TranchePricingCrowdsale {

    function CappedTranchePricingCrowdsale(uint256 _startTime, uint256 _endTime,
       uint256 _etherInvestmentObjective)
       TranchePricingCrowdsale(_startTime, _endTime, //
       _etherInvestmentObjective)
       payable public  {
    }

    function createFundingLimitStrategy()
        internal returns (FundingLimitStrategy) {

        return new CappedFundingStrategy(10000); //
    }
}
