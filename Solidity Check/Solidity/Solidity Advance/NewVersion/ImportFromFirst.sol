pragma solidity ^0.8;

import { Overflow, IncreaseByOne as AddOne } from "./first.sol"; 
//khi có function trùng tên với tên đã import sẽ bị lỗi, ta đổi sang tên khác là đc
function IncreaseByOne(uint x) pure returns(uint) { }

contract Import{ }