// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10;

contract Hello {
    string private message;
    
    constructor(string memory mes) {
        message = mes;
    }
    
    function setMessage(string memory mes) public {
        message = mes;
    }

    function getMessage() public view returns(string memory) {
        return message;
    }
}