const Web3 = require('web3');
const MyContract = require('./build/contracts/DeveloperFactory.json');
const init = async() => {
    const web3 = new Web3(process.env.PROVIDER_URL || 'http://localhost:9545');
    //nếu deploy lên mạng kp local thì phải có PROVIDER_URL bảo mật
    //local host chính là như API của mạng test này v
    const id = await web3.eth.net.getId();//trả ra network id
    const deployedNetwork = MyContract.networks[id];
    //thật ra khi build ra kết quả nó sẽ cho ra file js như v. File này còn chứa cả thông tin của networkid
    //nó là 1 danh sách các network id và smart contract của ta ở network id nào thì web3.eth.net.getId() sẽ 
    //trả ra cái đó là số thứ tự trong mảng chứa các network id build ra. Nếu muốn dùng web3js để test với
    //contract deploy bằng truffle thì mới dùng riêng như này, các mạng khác k chắc nó cx như này
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );
    //const result = await contract.methods.sayHello().call();
    contract.methods.createRandomDeveloper("Hieu",18).send({//gửi transaction function
        from: '0x204D33f223F0Daadb647C72EAcAD41fED5DE04DB',
        value: 5000000000000000000,
        gas: 1000000//chỉnh gas cho chuẩn, nó phải cỡ này
    }, function(error, transactionHash){
        console.log("dfafdsf");
        console.log(transactionHash);
    });
    //hàm này chỉ call constant method(pure, view) k đổi state, k gửi đi transaction nào hết
    // console.log(result);
}
init();
//khi ta build xong, thư mục build có chứa dữ liệu json của contract và trường abi chính là abi của contract
//ngoài ra còn nhiều trường khác như network id