// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

//Nhiều contract họ dùng hàm protected như dưới để bảo vệ contract bằng cách: k cho bất cứ contract
//nào tương tác với contract này mà chỉ cho người dùng. Bên trong isContract ta làm đúng tiêu chuẩn
//là code size phải là 0 thì là người chứ kp contract => Tuy nhiên ta vẫn có thể bypass được nó
contract Target {
    function isContract(address account) public view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;//codesize là 0 thì k là contract
    }
    bool public pwned = false;
    function protected() external {
        require(!isContract(msg.sender), "no contract allowed");
        pwned = true;
    }
}

contract FailedAttack {
    function pwn(address _target) external {
        // This will fail
        Target(_target).protected();
    }
}

contract Hack {
    bool public isContract;

    // When contract is being created, code size (extcodesize) is 0.
    constructor(address _target) {
        isContract = Target(_target).isContract(address(this));
        // This will work
        Target(_target).protected();
    }
}
//Tức là hàm isContract theo tiêu chuẩn của openzeppelin nếu ta gọi constructor của 1 contract khác
//thì codesize vẫn là k và nó k coi đó là 1 contract. Đây là 1 TH ngoại lệ rằng vẫn có thể bypass
//hàm isContract và gọi 1 hàm số từ constructor của contract khác