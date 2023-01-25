pragma solidity ^0.8.0;

//Interface có các cách dùng cho đến h: để gọi hàm của 1 contract khác trong 1 contract này -> gọi thông qua interface (đã biết);
//dùng kiểu 1 contract kế thừa 1 interface để báo hiệu contract này implement cái interface nào(cx đã biết)
//VD: gọi hàm contract khác
contract Original{
    function add(uint a, uint b) public pure returns(uint){
        return a + b;
    }
}

//bh contract A và B muốn dùng hàm add của contract original
interface addContract{
    function add(uint a, uint b) external pure returns(uint);
}
contract A{
    function useAdd(address address_) public pure returns(uint){
        return addContract(address_).add(1, 2);
    }
}

//Th trên là ta gọi 1 contract ở xa thông qua address của contract. Ta cx có thể gọi 1 contract thông qua từ khóa new
//nếu contract đó ở cùng file như này. Khi đó ta phải cho contract cần gọi kế thừa cái interface tự tạo ra. 
//Còn contract ở xa k kế thừa thì ta phải viết interface cho nó và gọi theo địa chỉ -> Dùng new là tạo instance mới r
//Ta phải cho kế thừa mới đc vì cái contract cần convert được sang interface đó nên là 1 instance của interface đó
interface addContract2{
    function add(uint a, uint b) external pure returns(uint);
}
contract Original2 is addContract2{
    function add(uint a, uint b) public pure override returns(uint){//khi kế thừa lại hàm phải dùng override
        return a + b;
    }
}
contract B{//chỉ cần deploy contract B k cần deploy contract Original2
    addContract2 obj;
    function useAdd() public returns(uint){
        obj = new Original2();
        //có thể éo dùng new mà dùng 1 địa chỉ có sẵn r với = Original2(address(<address>));
        return obj.add(1, 2);
    }
}
//Để ý cách dùng dưới khác cách dùng trên vì khi dùng new với 1 contract or interface thì nó hiểu là đổi state var nên sẽ
//thành 1 transaction mất gas trong khi cách dùng trên thì k. Ta có thể gọi hàm gán new vào 1 hàm transaction duy nhất để
//gọi nó trc khi dung để chỉ gọi new 1 lần cho tiết kiệm

//Có thể convert từ address sang string với abi.encodePacked thoải mái nhưng từ string sang address thì k
//interface có thể ké thừa; gọi trực tiếp tên của interface => khi đó nó như 1 hàm số nhận vào địa chỉ của contract để 
//thực thi các hàm bên trong; tạo ra 1 biến instance của interface đó như ví dụ trên
//chú ý 2 cách trên là độc lập k được dùng trộn kiểu: tạo 1 instance của interface với new nhưng contract đó lại kế thừa là sai
//Dùng ở xa, k kế thừa, dùng thông qua địa chỉ của contract
//Dùng cùng file, kế thừa, dùng thông qua instance từ khóa new -> or luôn luôn dùng như cách 1 tốt hơn vì tạo instance tốn gas

//try/catch chỉ là 1 cách khác của bắt lỗi như assert, revert, require
//try/catch chỉ dùng cho hàm external or contract creation. 
//=> try <gọi function>(tham số) returns(nếu có) { giá trị trả về có thể dùng ở đây }
//External chỉ nên dùng ở 1 function để cho 1 contract khác gọi tới nó, nhưng thực tế, ta gọi external function trong 
//contract hiện tại cx chả báo lỗi gì. Phải dùng thêm this
contract Example {
    function exampleFunction(uint256 _a, uint256 _b) public returns (uint256 _c) {
        try this.exFunc() returns(uint number) {
            return number;
        } catch Error(string memory _err) {
            //handle error
        } catch (bytes memory _err) {
            //handle error
        }
    }
    function exFunc() external pure returns(uint){
        return 1;
    }
}


contract X{
    function test() public pure returns(uint) {
        return 1;
    }
    function test1() public pure returns(uint) {
        return test();
    }
    function test2() public view returns(uint) {
        return this.test();
    }
}
//Phân biệt: gọi hàm với this là đọc từ state phải dùng view, còn gọi trực tiếp thì như bth; gọi với this là gọi như 
//1 đối tượng từ ngoài gọi độc lập nên call được cả hàm external ở ngay trong chính function còn gọi trực tiếp
//hàm k gọi được hàm external. VD test đổi thành external thì test1 sẽ báo lỗi
