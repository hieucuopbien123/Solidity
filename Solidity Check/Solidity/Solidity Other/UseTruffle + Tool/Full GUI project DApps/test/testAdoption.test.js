const Adoption = artifacts.require("Adoption"); //import contract
contract("Adoption", (accounts) => { //callback nhận vào account
    let adoption;
    let expectedAdopter;
    before(async () => {
        adoption = await Adoption.deployed();
    }); //before để thiết lập ban đầu
    describe("adopting a pet and retrieving account addresses", async () => {//nhóm 1 cụm các test case
        before("adopt a pet using accounts[0]", async () => {
            await adoption.adopt(8, {
                from: accounts[0]//truy cập danh sách account mạng test
            });
            expectedAdopter = accounts[0];
        });// nhân nuôi pet 8 là account[0] và check
        it("can fetch the address of an owner by pet id", async () => {
            const adopter = await adoption.adopters(8);
            assert.equal(adopter, expectedAdopter, "The owner of the adopted pet should be the first account.");
            //hàm assert là của Chai đó
        });
        it("can fetch the collection of all pet owners' addresses", async () => {
            const adopters = await adoption.getAdopters();
            console.log(adopters[8]);
            console.log(expectedAdopter);
            assert.equal(adopters[8], expectedAdopter, "The owner of the adopted pet should be in the collection.");
        });
    });
});