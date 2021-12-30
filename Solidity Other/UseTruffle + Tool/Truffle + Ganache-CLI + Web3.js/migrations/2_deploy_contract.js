const DeveloperFactory = artifacts.require('./DeveloperFactory.sol')

module.exports = function(deployer){
    deployer.deploy(DeveloperFactory);
}
//truffle compile và truffle migrate-> ganache nó tạo phát 4 block ứng với 4 transaction(nó cho là 1 block 1 trans)
//có 2 transaction là deploy 2 contract, mặc định nó có deploy cái contract migration.

//Tiếp theo, chạy truffle console để tương tác với blockchain của ta. Với truffle console, ta có thể dùng web3 js để thao
//tác với blockchain. Gõ từng lệnh 1 nó như liên tiếp nhau
/*<tên contract>.deployed().then(inst => {<tên var> = inst}) => var lưu rất nhiều thông tin
web3.eth.getBalance("0xE39978B9806733e2Cf4Ca420Cf40b200bfeD6F20").then(balance => {console.log(balance);}).catch(console.error); 
->in ra số dư tk hiện tại, chú ý getBalance là async
web3.eth.getAccounts().then( function (result) { return result[0] });
web3.eth.getAccounts()
web3.utils.toWei("5", "ether");
web3.utils.fromWei("14816000000000000","ether");// chuyển từ wei sang ether
100-89
web3.eth.getTransaction('0x0dafcea4f1174bec454bcc1414c0e474692c919a7d3299ad05c38eb3eddecc32')
.then(data => console.log(data.gasPrice));//tương tự truy cập vào blockHash, nonce, hash, gas, from, to,..
web3.eth.getGasPrice().then(console.log);
Factory.createRandomDeveloper('Damien', 26, {from: "<địa chỉ nào>", value: web3.utils.toWei("5", "ether")})
-> gọi hàm tạo transaction

DeveloperFactory.deployed().then(inst => {Factory = inst}) => truffle console thôi
Factory.sayHello() => truffle console thôi
*/