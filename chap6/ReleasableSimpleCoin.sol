pragma solidity ^0.4.24;

import "./SimpleCoin.sol";
import "./Pausable.sol";
import "./Destructible.sol";

contract ReleasableSimpleCoin is SimpleCoin, Pausable, Destructible {
    bool public released = false;

    modifier isReleased() {
        if(!released) {
            revert();
        }

        _;
    }

    function ReleasableSimpleCoin(uint256 _initialSupply)
        SimpleCoin(_initialSupply) public {}

    function release() onlyOwner public {
        released = true;
    }

    function transfer(address _to, uint256 _amount)
        isReleased whenNotPaused public {
        super.transfer(_to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount)
        isReleased whenNotPaused public returns (bool) {
        super.transferFrom(_from, _to, _amount);
    }
}
