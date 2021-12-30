const path = require('path');
const fs = require('fs');
var solc = require('solc');
const fileSystem = require("fs-extra");

const helloPath = path.resolve(__dirname, 'contracts', 'hello.sol'); //đường dẫn đến file sol muốn compile
const source = fs.readFileSync(helloPath, 'UTF-8'); //đọc file sol

var input = {
    language: 'Solidity',
    sources: {
        'hello.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log("Output: ", output);

//console.log ra bytecode xem
// for (var contractName in output.contracts['hello.sol']) {
//     console.log(
//         contractName +
//         ': ' +
//         output.contracts['hello.sol'][contractName].evm.bytecode.object
//     );
// }

//lưu kết quả abi và bytecode vào 2 file
var exportPath = path.resolve(__dirname, "bin")
fileSystem.removeSync(exportPath);
for (let contract in output.contracts["hello.sol"]) {
    fileSystem.outputJSONSync(
        path.resolve(exportPath, "helloABI.json"),
        output.contracts["hello.sol"][contract].abi
    );
    fileSystem.outputJSONSync(
        path.resolve(exportPath, "helloBytecode.json"),
        output.contracts["hello.sol"][contract].evm.bytecode.object
    );
}

module.exports = {
    bytecode: output.contracts["hello.sol"].Hello.evm.bytecode.object,
    interface: output.contracts["hello.sol"].Hello.abi
}