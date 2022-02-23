pragma solidity >=0.7.0 <0.9.0;

library SafeMath{
    function add(uint _x, uint _y) internal pure returns(uint) {
        uint z = _x + _y;
        require(z >= _x, "uint overflow");
        return z;
    }
}
//khi lib chỉ có internal function thì sẽ coi như paste luôn vào contract-> ta k cần deploy lib. Khi đó lib phải được
//compile cùng với contract
//lib có external or public-> phải deploy và link vào contract khác thì contract đó mới dùng được lib.
//điều đặc biệt là hàm trong lib dùng sẽ tránh lỗi gas giới hạn của contract k cho deploy

library Array{
    function remove(uint[] storage arr, uint index) public {//string, mảng, bytes hay mapping khi truyền phải có nơi lưu
        //nơi lưu ta đã specific là storage tức là thao tác trực tiếp với arr đó, k cần return r gán nx
        //public ở đây chả có vai trò gì, arr dùng storage tức là phải lấy từ state var của ethe r
        //đối số 1 luôn là kiểu biến muốn thao tác mở rộng, là bản thân biến gọi hàm này đó, từ 2 trở đi là truyền vào hàm
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }
}

contract TestLib{
    using SafeMath for uint;//mở rộng tính năng cho type
    uint MAX_UINT = 2**256 - 1;
    function testAdd(uint _x, uint _y) public pure returns(uint) {
        // return SafeMath.add(_x, _y);//dùng 1 lần k cần using for
        return _x.add(_y);//dùng như này với mọi biến uint, phải có using for mở rộng tính năng
    }
    
    using Array for uint[];
    uint[] public arr;
    function testLibArray() public {
        for(uint i = 0; i < 3; i++){
            arr.push(i);
        }
        arr.remove(1);
    }
}
