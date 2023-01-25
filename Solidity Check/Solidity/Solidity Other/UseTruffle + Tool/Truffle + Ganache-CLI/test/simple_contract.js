const SimpleContract = artifacts.require('SimpleContract');//chỉ định contract, dùng thế cho contract 
const truffleAssert = require('truffle-assertions');

console.log("Run test");
console.log(artifacts.require);//biến artifacts được sinh ra từ lúc compile xong r

contract('SimpleContract', (accounts) => {
  let instance;
  before('should setup the contract instance', async () => {
    instance = await SimpleContract.deployed();
    //tạo instance chung cho test
  });

  //test hàm
  it('should return the name', async () => {
    const value = await instance.getName();
    console.log(value);
    assert.equal(value, 'my name');
  });
  it('should return change the name', async () => {
    await instance.changeName('your name');
    const value = await instance.getName();
    assert.equal(value, 'your name');
  });

  //test modifier
  it("should fail", async () => {
    await truffleAssert.reverts(instance.changeName("modifier", {
      from: accounts[1]
    }));
  });

  //test event
  it('should check the type of the event', async () => {
    const result = await instance.changeName('hello event');
    truffleAssert.eventEmitted(result, 'NameEvent');
  });
  it('should emit with correct paremeters', async () => {
    const result = await instance.changeName('hello event');
    truffleAssert.eventEmitted(result, 'NameEvent', (event) => {
      return event.evPram == 'hello event';
    });
  });
  it('should print the event paremeters', async () => {
    let result = await instance.changeName('hello event');
    console.log(result);//với 1 hàm constant thì giá trị trả về là 1 giá trị thôi nhưng 1 hàm là transaction
    //thì là 1 object chứa rất nh thông tin
    truffleAssert.prettyPrintEmittedEvents(result);
  });
});

//khi ta test: cần có 1 blockchain network, xác định host và port của network đó-> chạy truffle test nó sẽ compile
//contract của ta và deploy lên đúng port và hosts cái mạng đó, chạy các hàm lần lượt và so sánh kết quả trả về và
//hiển thị cho ta. Đó là tối thiểu cho test còn để chạy 1 frontend Dapp với mạng blokchain thì thêm tí nx cơ.