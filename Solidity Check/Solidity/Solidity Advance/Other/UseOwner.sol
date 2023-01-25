// SPDX-License-Identifier:MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// OpenZeppelin là công ty chuyên cung các sản phẩn decentralized app. Nó cũng nổi tiếng với các thư viện có
//sẵn các contract hữu dụng như: Ownable, các loại token, Address, SafeMath, SafeCast, AccessControl
//Ownable còn có hàm đổi quyền, từ bỏ quyền owner, check ai là owner
contract UseOwnable is Ownable{
    uint public a = 0;
    function changeA() public onlyOwner {
        a++;
    }
}
