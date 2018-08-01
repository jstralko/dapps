pragma solidity ^0.4.18;
import "./Ownable.sol";

contract Pausable is Ownable {
    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() onlyOwner whenNotPaused public {
        paused = true;
    }

    function unpause() onlyOwner whenPaused public {
        paused = false;
    }
}
