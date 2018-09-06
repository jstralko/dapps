pragma solidity ^0.4.24;

contract FundingLimitStrategy {
    function isFullInvestmentWithinLimit(uint256 _investment, uint256 _fullInvestmentReceived)
        public view returns (bool);//
}

contract CappedFundingStrategy is FundingLimitStrategy {
    uint256 fundingCap;

    function CappedFundingStrategy (uint256 _fundingCap) public {
        require(_fundingCap > 0);
        fundingCap = _fundingCap;
    }

    function isFullInvestmentWithinLimit(uint256 _investment, uint256 _fullInvestmentReceived) //
        public view returns (bool) {

        bool check = _fullInvestmentReceived + _investment < fundingCap;
        return check;
    }
}

contract UnlimitedFundingStrategy is FundingLimitStrategy {
    function isFullInvestmentWithinLimit(uint256 _investment, uint256 _fullInvestmentReceived)
        public view returns (bool) {
        return true; //
    }
}
