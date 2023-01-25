// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

//tìm địa chỉ của address sẽ được deploy ra mà k cần deploy nó, ta tính trước được nếu deploy nó thì sẽ có address là gì
//ta tìm địa chỉ bằng create2 thì contract cx phải được deploy bằng create2 vì trường salt của nó
//đó là điểm khác biệt giữa create và create2 vì create deploy thẳng và return địa chỉ nhưng k compute đc address trc
contract Factory {
    event Deployed(address addr, uint salt);

    function getRunTime() public pure returns(bytes memory){
        return type(TestContract).runtimeCode;
        //creationCode là code dùng để deploy contract. runtimeCode là bytes code được execute khi call function trong smart contract
    }
    
    //ta tính trước address, r deploy bằng create2 và check. Thực chất ta đang mô phỏng lại thuật toán tạo đỉa chỉ contract của
    //create2 mà thôi chỉ có điều create2 còn deploy nx
    // 1. Get bytecode of contract to be deployed: _owner and _foo are arguments of the TestContract's constructor
    function getBytecode(address _owner, uint _foo) public pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_owner, _foo));
    }

    // 2. Compute the address of the contract to be deployed: _salt is a random number used to create an address
    function getAddress(bytes memory bytecode, uint _salt)
        public
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );//1 là 0xff, 2 là người deploy là contract này, _salt tùy ý ta chọn, 4 là createCode tính từ hàm trước

        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint(hash)));//thật tuyệt vời là uint160(uint) chỉ lấy 160 bits dầu của 256 bits
    }

    // 3. Deploy the contract
    // Check the event log Deployed which contains the address of the deployed TestContract.
    // The address in the log should equal the address computed from above
    function deploy(bytes memory bytecode, uint _salt) public payable {
        address addr;

        /*
        NOTE: How to call create2

        create2(v, p, n, s)
        create new contract with code at memory p to p + n(p: start of memory, n: size of code)
        and send v wei
        and return the new address
        where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
            s = big-endian 256-bit value
        */
        assembly {
            addr := create2(
                callvalue(), // wei sent with current call, lượng wei truyền vào hàm này ta lấy là lượng truyền vào
                //contract tạo ra
                // Actual code starts after skipping the first 32 bytes
                add(bytecode, 0x20),//32 bytes đầu được skip
                mload(bytecode), // Load the size of code contained in the first 32 bytes
                _salt // Salt from function arguments
            )

            if iszero(extcodesize(addr)) {//check nó phải là 1 contract
                revert(0, 0)
            }
        }
        emit Deployed(addr, _salt);
    }
}

contract TestContract {
    address public owner;
    uint public foo;

    constructor(address _owner, uint _foo) payable {
        owner = _owner;
        foo = _foo;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
