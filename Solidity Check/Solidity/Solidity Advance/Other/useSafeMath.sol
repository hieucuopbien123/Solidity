pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

//SafeMath là library tính toán. SafeCast để convert
contract UseSafeMath{
    using SafeMath for uint;
    function cal() public pure returns(uint){
        uint a = 1;
        uint b = 2;
        return b.sub(a);
    }
    //thư viện SafeMath bh k cần thiết nx khi mà phiên bản hiện tại nó đã tự check tràn để báo lỗi r

    using SafeCast for uint;//chỉ dùng chuyển giữa uint và int bao nhiêu bit
    function castToUint8(uint _a) public pure returns(uint8) {
        return _a.toUint8();
    }
}
