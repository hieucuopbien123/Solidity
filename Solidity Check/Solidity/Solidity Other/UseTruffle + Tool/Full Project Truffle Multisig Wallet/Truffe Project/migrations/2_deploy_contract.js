const MultisignatureWallet = artifacts.require("MultisignatureWallet");

//import contract-> khởi tạo tham số cho constructor-> deploy vào mạng đã được chỉ định trong config. Tùy ý ta chỉ định
//Nếu ta gõ: truffle develop-> migrate => thì nó sẽ deploy vào truffle develop đó 
module.exports = function (deployer, network, accounts) {
    const owners = accounts.slice(0, 3);
    const numConfirmationRequired = 2;
    deployer.deploy(MultisignatureWallet, owners, numConfirmationRequired);
};
