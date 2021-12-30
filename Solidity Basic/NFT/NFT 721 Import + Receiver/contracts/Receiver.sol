// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Receiver{
    function onERC721Received(//phải có hàm này ms nhận được bằng safeTransferFrom
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        msg.sender.call(data);
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }
    function getData(address addr, uint tokenId) public view returns(bytes memory) {
        return abi.encodeWithSignature("transferFrom(address,address,uint256)",
        address(this), addr, tokenId);
    }
}
//vai trò của data trong các hàm thực ra là để dùng nt này, ta có thể gọi tiếp thêm 1 hàm
//nx ngay tại onERC721Received bằng cách truyền vào thông qua đối số data để gọi
//Ở đây ta truyền vào kèm data là hàm transfer gửi tiếp cho address kia token thứ 10
//nếu truyền data là như v
//Nếu k gọi ở đây cx chả sao nếu bên trong hàm receive có hàm nào khác gọi transfer cx đc
//Nhưng nếu k có hàm nào khác gọi transfer như v thì NFT sẽ bị lock trong contract mãi mãi