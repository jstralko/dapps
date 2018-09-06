pragma solidity ^0.4.24;

interface ReleasableToken {
    function mint(address _beneficiary, uint256 _numberOfTokens) public;
    function release() public;
    function transfer(address _to, uint256 _amount) public;
}
