// SPDX-License-Identifier:MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

//AccessControl là contract kiểm soát quyền access của từng người. VD 1 contract muốn ông A là minter, ông B là burner,..
contract UseAccessControl is Context, AccessControl{//chú ý kế thừa đúng thứ tự
    //phải tạo kiểu này
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant ADMIN_MINTER_ROLE = keccak256("ADMIN_MINTER_ROLE");
    constructor(address minter1, address minter2, address burner) {
        //contract kế thừa có thể gọi được các hàm internal nhưng k truy cập được biến private
        _setupRole(MINTER_ROLE, minter1);
        _setupRole(MINTER_ROLE, minter2);
        _setRoleAdmin(MINTER_ROLE, ADMIN_MINTER_ROLE);
        _setupRole(ADMIN_MINTER_ROLE, minter2);

        _setupRole(BURNER_ROLE, burner);
        _setupRole(BURNER_ROLE, _msgSender());
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    function mint() public view {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        //code mine
    }
    function burn() public view {
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        //code burn
    }
    function testRole() public view onlyRole(MINTER_ROLE) {
        //msg.sender phải là role MINTER_ROLE mới gọi được hàm này
    }
    //Có nhiều loại role, mỗi loại role có 1 adminRole riêng. Mặc định rất cả admin role đều là 
    //0x00 => ai là admin của role nào thì có thể: bỏ role của mình bằng renounceRole, cấp role cho
    //người khác với grant, xóa role của ng khác trong cùng loại với revoke, setRoleAdmin
    //Nếu k sửa đổi gì thì role 0x00 sẽ là admin của tất cả. Ở trên có 2 minter ta sửa role admin của
    //minter là ADMIN_MINTER_ROLE còn role admin của burn vẫn là mặc định thì admin của burn là ông msg.sender còn
    //admin của minter là minter2, ông ta cũng mint được luôn vì cx là 1 member
}
