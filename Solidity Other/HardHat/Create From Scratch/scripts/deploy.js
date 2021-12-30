console.log("3");
async function main() {
    const [deployer] = await ethers.getSigners();
    //1 node có nhiều account và hàm này lấy ra mảng các account của node đó, mặc định nó lấy master account[0]
    // console.log(hre);
    console.log("3");

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();

    console.log("Token address:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });