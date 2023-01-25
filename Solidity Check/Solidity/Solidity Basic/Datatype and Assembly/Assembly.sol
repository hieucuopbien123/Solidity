pragma solidity ^0.8.0;

//còn nhiều hàm nx như iszero, callvalue(là msg.value) mà được test trong bài create2
contract A{
    function foo() external {
        uint c;
        assembly {
            c := add(1, 2) //có thể dùng các opcode như add. Dùng TT biến bên ngoài
            let a := mload(0x40) //let tạo biến mới, mload là load data từ địa chỉ nào
            mstore(a, 2)//mstore lưu data trong bộ nhớ tạm thời
            sstore(a, 10)//sstore lưu data vào storage
        }
    }
    
    //VD: dùng assembly check 1 địa chỉ có phải contract k. Trong oppenzepplin đã có sẵn hàm này
    function checkIsContract() public view returns(bool){
        address addr = msg.sender;
        uint size;
        assembly{
            size := extcodesize(addr)//là 1 opcode trả ra kích thước của code ở 1 ethereum address
            //trong ethereum. Nếu addr có kích thước code bằng 0 thì là address ng dùng, kích thước code
            //> 0 thì là contract address. Tùy code dài thì kích thước càng lớn
        }
        if(size > 0)
            return true;
        else
            return false;
    }
    //VD: chuyển từ bytes sang bytes32
    function convert() public pure {
        bytes memory data = new bytes(10);
        // bytes32 b32 = bytes32(data);
        bytes32 b32;
        //k thể cast sang bytes32(data) vì 1 cái bộ nhớ động, 1 cái nhớ tĩnh. Nhưng ta có thể dùng assembly để chỉ lấy 32 bytes
        //đầu của bytes lưu vào bytes32 mà k quan tâm phần sau
        assembly{
            b32 := mload(add(data,32))
            //truyền vào địa chỉ cần lấy thì data là address bytes của ta đúng r nhưng thực tế, nó lưu 32 bytes đầu là kích thước
            //của data cơ, nên dữ liệu bắt đầu sau 32 bytes. Ta cộng 32 để nó lấy đúng vị trí địa chỉ
            //hàm mload lấy 32 bytes ở địa chỉ nào. VD: mload(0x40) là lấy 32 bytes đầu ở địa chỉ 0x40
            //VD: ta mload(address) thì sẽ lấy 32 bytes đầu ở địa chỉ đó nhưng mload(add(address, 12)) sẽ lấy 
            //re bytes đầu kể từ 12 bytes sau địa chỉ đó tức là từ address+12 đến address+43
        }
    }
    
    function testLoopInAssembly(uint v) public pure returns(uint h){
        assembly{
            //assembly có giá gas rất rẻ
            for { let c:= 0}
                lt(c, 10)
                {c := add(c, 1)}
            {
                h := add(h, 1)//tương tự sub, mul, div
            }
            
            switch v
            case 1 {
                h := 11
            }
            case 2 {
                h := 22
            }
            default {
                h := 33
            }
        }
    }
    function testAssembly2() public pure returns(uint){
        assembly{
            let ptr := add(msize(), 1)
            mstore(ptr, 255)
            mstore(add(ptr, 32), 56)
            return(ptr, 64)
            // return(add(ptr, 32), 64)
            //kết quả trả ra là 0x<60 số 0>ff vì ta gán 32 bytes đầu là số 255(10) = ff(16) mà nó lưu viết từ phải qua
            //nên là như v. Dù ta cho return 64 bytes đầu nhưng chỉ lấy về được bytes32 nên thầy kết quả là như v
            //Nếu dùng returns(bytes31) thì sẽ ra toàn 0 vì bytes cuối là ff sẽ k thấy và cx k đugns quy tắc từng cục 32
            //Dù ta return(ptr,1000) vẫn ra 0x...ff vì chỉ lấy 32 bytes đầu. 
            //Nếu ta dùng return như comment thì lấy được giá trị 56 lưu từ bytes 32 đến 64
            //k return mảng được nên chỉ lấy được luôn là 1 cục bytes32 như này
            //Chú ý là ta thao tác theo từng cục 32 bytes 1 và phải tuân thủ lưu đúng là đầu mỗi 32 bytes
            //Nếu ta lưu số 255 ở giữa add(ptr,20) thì sẽ k lấy được vì lưu sai, k có ý nghĩa. Ta chỉ lưu được sau
            //mỗi 32 bytes và lấy cx v
            //Dù đề bài k cho lấy ra 1 mảng nhưng ta có thể returns nhiều biến bytes32 để lấy nh giá trị cx đc
            //do bytes32 convert qua uint trực tiếp được nên dùng như này. Tương tự string vs bytes
            
            //hàm add skip bao nhiêu byte của cái gì và trả ra pointer tới vị trí mới
        }
    }
    function testAssembly(uint v) public pure returns(bytes32){
        assembly{
            //msize() trả ra kích thước bộ nhớ ở thời điểm hiện tại và cũng là index cuối cùng của meomry đã allocated
            //và ta +1 để access ngay vào ô nhớ sau nó
            let ptr := add(msize(), 1)//ô nhớ trống đầu tiên
            mstore(ptr, v)// lưu vào ô nhớ đó giá trị v
            return(ptr, 0x20)//hàm return là return của hàm số từ ptr đến ptr + 0x20 
            //chú ý 0x20 tương ứng với 32, ta dùng dạng nào cx đc. Tương tự 0x40 là 64 bytes
            //kết quả ta bắt dạng biến bth(kp là mảng nhé), có thể là uint or bytes32 ví dụ số 32 là 0x20 thì bắt là 
            //0x<60 số 0>20 -> nên nếu bắt bằng bytes1 sẽ chỉ thầy 0x00 để nhìn toàn bộ phải bắt bằng bytes32
            //vì 32(10) = 0020(16)
        }
    }
    
    //mload xuất hiện
    function testAssembly3() public pure returns(uint z){
        assembly{
            z := add(keccak256(0x0, 0x20), div(32, 32))
            //keccak256 trả ra hash 32 bytes, coi là 1 uint và + 1 vào r return
            let x := 0x123
            let y := 43
            let w := "hello world"//chú ý mỗi biến bên trong đều là 32 bytes max-> ta lưu quá nhiều số ở đây sẽ error tràn memory
            {
                let k := 1 //ra khỏi ngoặc {} này k sẽ bị xóa
            }
            //ta chỉ được gán giá trị cho z chứ k đc read, z là write only
            let c := mload(x)//trả ra memory từ x đến x+32
        }
        assembly{
            let x := 1
            if slt(x, 0) { x := sub(0, x) }
            if eq(x, 0) { revert(0, 0) }//revert là revert trong solidity và trả ra data từ 0 đén 0+0
            let y := calldataload(1)
            //mload là lấy giá trị 32 bytes từ đâu, calldataload sẽ trả ra data location chứa tham số truyền vào function
            //khi biên dịch thì function sẽ có vài arguments truyền vào mặc định
            z := y
        }
        assembly{
            function allocate(length) -> pos {
                pos := mload(0x40)//giá trị trả ra của mload là memory
                mstore(0x40, add(pos, length))
            }
            let free_memory_pointer := allocate(64)
            //nỏ trả ra 128 vì: vào hàm pos sẽ lưu địa chỉ vị trí 64 và giá trị của nó cũng là 64-> sau đó nó cộng 64
            //thành 128 và mstore là lưu vào storage vị trí 64 thành ra vị trí 64 trở đi 32bytes lưu giá trị 128 và lấy
            //ra pos là giá trị 64 trở đi 32bytes trả ra số lưu vào free_memory_pointer là thành 128
            z := free_memory_pointer
        }
        //cần phân biệt rõ ràng là ta đang lưu và thao tác với biến hay giá trị. VD: add(1,2) là cộng 2 số
        //nhưng add(địa chỉ, 1) là coi địa chỉ kia là 1 số rồi + với 1 là sang ô địa chỉ tiếp theo. Hay nói cách khác
        //biểu diễn địa chỉ cx chỉ là 1 số như số int bình thường và cộng trừ bth.
        //VD: add(0x80, 3) = 131 nhưng add(mload(0x80),3) = 3 vì giá trị tại ô 0x80 giả sử đang là 0 ta lấy +3 thì =3
        assembly {
            function f() -> a, b {}//return nhiều biến
            let c, d := f()
            mstore(0x80, add(mload(0x80), 3))//tức là mstore(0x80, 3)
            let p := mload(0x80)
        }
    }
}
