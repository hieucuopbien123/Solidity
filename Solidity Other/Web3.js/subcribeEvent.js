const Web3 = require("web3");//lk với App
const abi = require("./abi.json");//smart contract SAI coin
const INFURAL_URL = "wss://mainnet.infura.io/ws/v3/eca64c547908458d815f129e14d67083";//API
const address = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359";//dịa chỉ contract sai coin
const web3 = new Web3(new Web3.providers.WebsocketProvider(INFURAL_URL));//lk app với api ethereum
//httpprovider k còn dùng trong web3 để subcribe nx vì deprecated
//Để subcribe event thì phải dùng provider. Có 2 loại Provider là HttpProvider, WebsocketProvider
//Ta phải dùng WebsocketProvider mới đc. Khi dùng như v thì url phải có scheme là wss
//bth ta chạy 1 lần thỉ k cần provider, nhưng subscribe tức là nó luôn luôn bắt event khi nào có thì báo. Khi đó
//cần dùng 1 providers để liên kết liên tục với ethe blockchain
async function main() {
    const contract = new web3.eth.Contract(abi, address);
    //events là trường của object contract lưu mọi event, Transfer là tên của event. Ta gọi hàm event Transfer() bị 
    //biến thành hàm có 2 đối số: 1 là object của events, ở đây ta lọc events; 2 là hàm số nhận vào 2 đối số: 1 là 
    //error nếu có lỗi; log là giá trị trả về nếu k có error, nó là object có length or returnValues,..
    //returnValues là object trả ra các trường đã truyền vào event khi emit
    //Hàm này sẽ chờ events này được gọi, miễn ta k tắt Ct nó sẽ chờ bắt sự kiện mãi
    contract.events.Transfer(
        {
            filter: {src: "0x762d141b8D9600bde64138762E6Fb38Efc56dcBA"}
            //cái nào có indexed thì có thể lọc bằng filter
        },
        (error, log) => {
            if(error)  
                console.log("Error: " + error);
            console.log("Log: " + log);
        }
    )
}

main();

console.log(web3.providers);
console.log(web3.eth.providers);