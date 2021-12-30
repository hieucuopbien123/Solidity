const SimpleContract = artifacts.require('SimpleContract');
//artifacts.require giống require của contract nhưng trả về bản tom tắt.
//Nch là sau khi compile, ta có thể import contract như này r deploy nó bên dưới
console.log("run contract");
console.log(artifacts.require);
module.exports = function(deployer) {
  //deploy cái contract của ta lên mạng blockchain
  deployer.deploy(SimpleContract);
};