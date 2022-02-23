// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
contract D {
    uint public x;
    constructor(uint a) payable {
        x = a;
    }
}

contract C {
    D d = new D(4); // will be executed as part of C's constructor khi dùng k ở trong bất cứ 1 hàm nào
    //nhưng điều đb là khai báo instance ở bên ngoài

    function createD(uint arg) public {
        D newD = new D(arg);
        newD.x();//hàm get ngầm tự đc tạo r. Có thể gọi hàm ez như này
        //gọi x chứ hàm này k return, k return thì k xem được giá trị x đâu
    }
    
    function returnSender() public view returns (address) {
        return msg.sender;
    }
    function returnOrigin() public view returns (address) {
        return tx.origin;
    }
}

contract B {
    C a = C(address(0xDA0bab807633f07f013f94DD0E6A4F96F8742B53));//copy địa chỉ contract C vừa được deploy vào đây
    //Đây là TH 1 contract, ta có thể dùng contract C ở 1 file khác và deploy lấy address còn C ở đây là interface
    //contract đó cũng tương tự => nch là contract bình thường bản thân nó cũng dùng được như interface
    function returnSender() public view returns (address) {
        return a.returnSender();
    }
    function returnOrigin() public view returns (address) {
        return a.returnOrigin();
    }
    //hàm tx.origin luôn trả ra đối tượng gốc tạo transaction. msg.sender trả ra địa chỉ gần nhất gọi hàm
    //Ở đây: Account->gọi hàm contract B-> gọi hàm của A
    //msg.sender trả ra địa chỉ contract B, còn tx.origin trả ra account gốc
}
