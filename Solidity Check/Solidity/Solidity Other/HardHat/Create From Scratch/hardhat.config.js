require("@nomiclabs/hardhat-waffle");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "5V4GIUUGdfNWeIUMN8VOf9IscNvRoT3S";
console.log("1");

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const KEY = fs.readFileSync(".secret").toString().trim();
const ROPSTEN_PRIVATE_KEY = KEY;

//trước khi run các task hay gì, hardhat sẽ nhúng hre phạm vi global và biến mỗi key của hre thành 1 global variable. 
//Khi task hoàn thành xong thì global var đó bị removed
//từ hre, user có thể build thêm các thứ on top of hardhat và dùng nó phạm vi global bằng cách tự thêm các trường
//cho hre và có thể dùng ở mọi chỗ khác vì các trường đó tự động thành global var. ĐN trong hardhat.config synchronous
//Vd ta thêm instance của web3.js vào hre như dưới dù điều này k cần thiết vì có sẵn plugin hardhat-web3 r
extendEnvironment((hre) => {
  const Web3 = require("web3");
  hre.Web3 = Web3;
  // hre.network.provider is an EIP1193-compatible provider.
  hre.web3 = new Web3(hre.network.provider);
});

module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`]
    }
  }
};
//Cơ chế: ta tạo ra 1 dự án API bằng Alchemy cho phép ta dùng API để tương tác với Ethereum blockchain, sau đó dùng tài
//khoản của ta để deploy contract lên trên Ethereum network. Chỉ cần 2 đầu vào như này: tk của ta + API key để tương
//tác ethereum blockchain
