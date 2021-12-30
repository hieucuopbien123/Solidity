const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
require("dotenv").config();
const {
    interface,
    bytecode
} = require('./compile');

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.INFURA_URL
);

const web3 = new Web3(provider);
// web.setProvider(provider);//khi web3 có instance r

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attemping to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(interface)
        .deploy({
            data: "0x" + bytecode,
            arguments: ['Hi there!']
        })
        .send({
            gas: '1000000',
            from: accounts[0]
        });

    // console.log(interface);
    console.log('Contract deployed to ', result.options.address);
    provider.engine.stop();
};

deploy();