// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Recover {

    function recover(address _addr) public  pure returns (address){
        address nonce1= address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xd6), bytes1(0x94), _addr, bytes1(0x01))))));
        return nonce1;
    }
  
  }
