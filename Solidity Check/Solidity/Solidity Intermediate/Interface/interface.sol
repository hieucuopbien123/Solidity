pragma solidity >=0.7.0 <0.9.0;

//dùng 1 hàm của 1 contract khác thông qua interface. Chú ý các hàm trong interface phải có cấu trúc y hệt các 
//hàm của contract kể cả tên, chỉ có implementation là k cần viết. K cần biết bên trong như nào, chỉ cần biết cú pháp
//thế này ta dùng call cx tương tự thôi nhưng khi call nhiều hàm của 1 contract thì nên tách ra như này để phân chia
interface ICounter{
    function count() external view returns(uint);
    function increment() external;
}

contract MyContract{
    function incrementCounter(address _counter) external {
        ICounter(_counter).increment();//dùng như bth thông qua địa chỉ=> <tên interface>(<địa chỉ>).<hàm>(<param>)
    }
    function getCount(address _counter) external view returns(uint) {
        return ICounter(_counter).count();
    }
    //các hàm này k được gọi lại trong contract này mà chỉ dùng được ở ngoài
}

// Uniswap example: ta sẽ lấy address contract quản lý pair là dai và weth-> lấy xem trong pool đó
//hiện tại còn bao nhiêu dai và weth. Để làm điều này ta phải thao tác trên mainnet: kết nối dùng environment
//là injected web3->chỉ còn 1 account là ví của ta. Nếu thực hiện transaction thì tài khoản của ta sẽ mất gas
//Ở VD này, các contract có hàm cần dùng đã deploy sẵn r, ta chỉ refer đến nó để thao tác
interface UniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}//dùng interface thao tác với hàm này trong contract đã đc deploy của uniswap

interface UniswapV2Pair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}
contract UniswapExample {
    address private factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address private weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    //factory là địa chỉ của contract chứa hàm getPair của uniswap. dai và weth là địa chỉ của 2 đồng coin dai và weth

    function getTokenReserves() external view returns (uint, uint) {
        address pair = UniswapV2Factory(factory).getPair(dai, weth);
        (uint reserve0, uint reserve1, ) = UniswapV2Pair(pair).getReserves();
        //k truyền đối số nào thì bỏ trống-> vẫn có dấu phẩy
        return (reserve0, reserve1);
    }
}
//Test: chạy từng hàm interface với địa chỉ đã deploy. Hàm getTokenReserves ta k dùng vì éo có ether mà dùng ấy nên 
//chỉ dùng interface với các hàm có sẵn
