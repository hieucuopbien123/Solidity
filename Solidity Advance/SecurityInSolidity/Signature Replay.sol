// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
pragma experimental ABIEncoderV2;
import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/cryptography/ECDSA.sol";
//signature replay attack có 3 case:
//1) multisig wallet or 1 contract bình thường: A cho phép B dùng 1 ether của mình -> B rút 1 ether
//là 2 contract thì cải tiến thành: A ký trans cho B dùng 1 ether của mình -> B lấy signature A đã
//ký kèm với signature của mình rằng dùng 1 ether đó để rút ether của A ra
//Lỗi: B dùng đi dùng lại nhiều lần signature để rút hết tiền của A
//Fix: thêm nonce sau mỗi lần ký -> B k thể tái sử dụng nx vì nonce khác
//2) contract samce code, different address: Khi sang 1 contract mới thì nonce luôn là 0 nên B có 
//thể dùng signature khi nonce là 0 của A ở contract trước có same code để thực hiện với contract này
//Fix: thêm nonce và cả address của contract vào signature là xong
//3) contract tạo bởi create2 và bên trong có self-destruct: B dùng signature của A để nhận tiền
//xong self destruct contract đi làm nonce về lại 0 xong lại dùng tiếp sig của A để nhận tiền ở
//contract mới(ở đây giả sử mỗi khi contract đc create2 tạo ra thì A làm gì đó mà gửi tiền vào nên B
//dùng lại sig để lấy)
//Fix: k fix được vì create2 mặc định tạo contract mới miễn code k đổi thì địa chỉ nó chỉ có 1 và 
//nonce bị reset về 0 nên chỉ có cách là có selfdestruct thì k dùng signature như v
//2 TH đầu thì ERC 2612 có dùng permit có sẵn cho ta rùi. Ở dưới là ta implement lại thủ công

contract MultiSigWallet {
    using ECDSA for bytes32;
    address[2] public owners;
    mapping(bytes32 => bool) public executed;//signature đã dùng r cấm dùng lại
    //đang giả sử multisigwallet có 2 địa chỉ. Khi cả 2 xác nhận thì mới chuyển tiền nhưng ở đây
    //ta k 3 trans để A, B xác nhận xong B gửi nx mà gom vào 1: A đưa sig cho B, B dùng sig A và sig
    //của mình thực hiện chuyển phát xong luôn
    constructor(address[2] memory _owners) payable {
        owners = _owners;
    }
    function deposit() external payable {}
    //lấy sig và check chuyển tiền luôn mà k cần thông qua 2 trans
    function transfer(address _to, uint _amount, uint _nonce, bytes[2] memory _sigs) external {
        bytes32 txHash = getTxHash(_to, _amount, _nonce);
        require(!executed[txHash], "tx executed");
        require(_checkSigs(_sigs, txHash), "invalid sig");
        executed[txHash] = true;
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function getTxHash(address _to, uint _amount, uint _nonce) public view returns (bytes32) {
        return keccak256(abi.encodePacked(address(this), _to, _amount, _nonce));
        //trong đây có cả address contract này và nonce để signature mỗi lần dùng là duy nhất
    }
    //code để check thôi
    function _checkSigs(bytes[2] memory _sigs, bytes32 _txHash) private view returns (bool) {
        bytes32 ethSignedHash = _txHash.toEthSignedMessageHash();
        for (uint i = 0; i < _sigs.length; i++) {
            address signer = ethSignedHash.recover(_sigs[i]);
            bool valid = signer == owners[i];
            if (!valid) {
                return false;
            }
        }
        return true;
    }
}