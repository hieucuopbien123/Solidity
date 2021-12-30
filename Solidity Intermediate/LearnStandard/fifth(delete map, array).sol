pragma solidity >=0.7.0 < 0.9.0;

contract Array {
    uint[] public myArray = [1, 2];//size có thể đổi khi contract compile
    uint[10] public fixedSize;//10 giá trị 0 mặc định=> kích thước mảng sẽ k thể đổi
    function push(uint i) public {
        myArray.push(i);
    }
    function pop() public {
        myArray.pop();
    }
    function getLength() public view returns(uint) {
        return myArray.length;//giá trị return là giá trị xem được của hàm
    }
    function remove(uint index) public {
        delete myArray[index];//hàm delete đưa giá trị về mặc định và k giảm length ta có thể xóa nó ra khỏi mảng nếu
        //k qt thứ tự bằng cách: gán vị trí index bằng phần tử cuối cùng-> pop phần tử cuối cùng. Nếu k qt đến thứ tự
        //thì như v, nếu k phải dùng vòng for
    }
    
    //map trong solidity k thể iterate or lấy size TT như js,C++ ->ta vẫn làm được nếu nhét các key vào array và
    //iterate array và lấy size bằng cách lưu size vào biến uint
    mapping(address => uint) public myMap;//key phải là built-in như address, int, string; value là mọi type luôn
    //tức là mapping or array đều đc
    mapping(address => mapping(address => uint)) public nestedMap;
    function getMap(address _addr) public view returns(uint) {
        return myMap[_addr];//key chưa set, value vẫn có là mặc định
    }
    function setMap(address _addr, uint _i) public {
        myMap[_addr] = _i;
    }
    function removeELeInMap(address _addr) public {
        delete myMap[_addr];
    }
    //các function k là transaction như getter cx có thể cho throw error nó tự chuyển thành revert và k mất gas như bth
    //mapping có key có thể là enum nhưng k thể là struct. mapping có thể map 1 contract sang 1 uint cx đc vì contract
    //ở đây cx như 1 address mà thôi
}
