pragma solidity >=0.7.0 <0.9.0;

//D kế thừa từ B và C, cả 2 lại kế thừa từ A
contract A{
    event Log(string mess);//string trong event k cần điền lưu ở đâu
    function foo() public virtual {
        emit Log("A called");//event sẽ hiện ra trong transaction log. Có thể dùng trace theo function như này
    }
}

contract B is A{
    function foo() public virtual override {
        emit Log("B called");
        super.foo();
    }
}
contract C is A{
    function foo() public virtual override {
        emit Log("C called");
        super.foo();
    }
}

contract D is C, B{
    function foo() public override(C, B) {
        super.foo();
    }
}
//super gọi hàm của cha từ phải qua trái, nhưng nếu cùng gọi hàm kế thừa từ 1 class thì sẽ gọi cả 2 foo của B và C nhưng
//chỉ gọi A 1 lần. NN vì mỗi kiểu kế thừa khác nhau thì sẽ gọi khác nhau. VD như D kế thừa B và C độc lập thì sẽ chỉ gọi
//1 từ trái qua như file trước. Nhớ v, gọi 2 contract độc lập khác gọi 2 contract cùng derive từ 1 contract khác
