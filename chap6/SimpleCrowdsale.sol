pragma solidity ^0.4.18;

import "./ReleasableSimpleCoin.sol";
import "./Ownable.sol";
import "./Destructible.sol"

contract SimpleCrowdsale is Pausable, Destructible {
    uint256 public startTime;
    uint256 public endTime;
    uint256 public weiTokenPrice;
    uint256 public weiInvestmentObjective;

    mapping (address => uint256) public investmentAmountOf;
    uint256 public investmentReceived;
    uint256 public investmentRefunded;

    bool public isFinalized;
    bool public isRefundingAllowed;

    ReleasableSimpleCoin public crowdsaleToken;

    //2003526559, 2003526600, 2000000000000000, 15000
    function SimpleCrowdsale(uint256 _startTime, uint256 _endTime,
       uint256 _weiTokenPrice, uint256 _weiInvestmentObjective)
     payable public
    {
        require(_startTime >= now);
        require(_endTime >= _startTime);
        require(_weiTokenPrice != 0);
        require(_weiInvestmentObjective != 0);

        startTime = _startTime;
        endTime = _endTime;
        weiTokenPrice = _weiTokenPrice;
        weiInvestmentObjective = _weiInvestmentObjective;

        crowdsaleToken = new ReleasableSimpleCoin(0);
        isFinalized = false;
    }

    event LogInvestment(address indexed investor, uint256 value);
    event LogTokenAssignment(address indexed investor, uint256 numTokens);
    event Refund(address investor, uint256 value);

    function invest() public payable {
        require(isValidInvestment(msg.value));

        address investor = msg.sender;
        uint256 investment = msg.value;

        investmentAmountOf[investor] += investment;
        investmentReceived += investment;

        assignTokens(investor, investment);
        LogInvestment(investor, investment);
    }

    function isValidInvestment(uint256 _investment)
        internal view returns (bool) {
        bool nonZeroInvestment = _investment != 0;
        //bool withinCrowsalePeriod = now >= startTime && now <= endTime;
        bool withinCrowsalePeriod = true;

        return nonZeroInvestment && withinCrowsalePeriod;
    }

    function assignTokens(address _beneficiary,
        uint256 _investment) internal {

        uint256 _numberOfTokens = calculateNumberOfTokens(_investment);

        crowdsaleToken.mint(_beneficiary, _numberOfTokens);
    }

    function calculateNumberOfTokens(uint256 _investment)
        internal returns (uint256) {
        return _investment / weiTokenPrice;
    }

    function finalize() onlyOwner public {
        if (isFinalized) revert();

        //bool isCrowdsaleComplete = now > endTime;
        bool isCrowdsaleComplete = true;
        bool investmentObjectiveMet = investmentReceived >= weiInvestmentObjective;

        if (isCrowdsaleComplete)
        {
            if (investmentObjectiveMet)
                crowdsaleToken.release();
            else
                isRefundingAllowed = true;

            isFinalized = true;
        }
    }

    function refund() public {
        if (!isRefundingAllowed) revert();

        address investor = msg.sender;
        uint256 investment = investmentAmountOf[investor];
        if (investment == 0) revert();
        investmentAmountOf[investor] = 0;
        investmentRefunded += investment;
        Refund(msg.sender, investment);
        /*
         * I have decided to refund investors through send() rather than transfer()
         * only because transfer() has some quirks in Remix (at the time of writing)
         * and might generate unwanted error messages which will slow down your
         * learning experience. In a production environment transfer() is recommended.
         */
        if (!investor.send(investment)) revert();
    }
}
