import web3 from './web3';

const address = '0x1a5fA98D9c7AF162C64E7Ee283278B303e418D0d';

const abi = [{
        "inputs": [{
            "internalType": "string",
            "name": "mes",
            "type": "string"
        }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "getMessage",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "string",
            "name": "mes",
            "type": "string"
        }],
        "name": "setMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

export default new web3.eth.Contract(abi, address);