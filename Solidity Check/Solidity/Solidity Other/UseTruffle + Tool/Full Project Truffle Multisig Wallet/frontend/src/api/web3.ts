import Web3 from "web3";

//@ts-ignore là cái bỏ lỗi nếu có trong typescript vì typescript nó check lỗi là báo luôn từ compilation mà
export async function unlockAccount(){
    //@ts-ignore
    const { ethereum } = window;
    //ta k thể viết window.ethereum vì ethereum k tồn tại mặc định trên window gây lỗi. Ta lấy như trên thì ok
    if(!ethereum) {//or typeof ethereum == "undefined"
        throw new Error("Web3 not found");
    }
    const web3 = new Web3(ethereum);
    await ethereum.enable();//nếu đã connect với trang web này r và đã đăng nhập r thì nó tự có luôn chứ k popup nx
    const accounts = await web3.eth.getAccounts();
    const netId = await web3.eth.net.getId();
    //cái account này kp là 1 list account sinh từ key đâu mà là key hiện tại của người dùng(mảng 1 phần tử)
    //Với window ethereum thì nó là như v=> mỗi lần chuyển tài khoản là phải connect lại
    console.log(accounts);
    return { web3, account: accounts[0] || "", netId};
    //nếu account bị lỗi or k tồn tại thì trả ra 1 string trống ""
}
//người dùng hiện tại có thể đổi sang account khác thì ta cũng phải bắt liên tục và in ra dữ liệu tương ứng
//Cơ chế: ta tạo ra hàm được gọi liên tục mỗi 1s 1 lần. Trong hàm này sẽ liên tục gửi account hiện tại của
//window.ethereum vào cho front end hiển thị-> ta tự bắt và gửi liên tục chứ k hề có hàm chỉ tự động gọi khi
//người dùng đổi account đâu
export function subscribeToAccount(
    web3: Web3,
    callback: (error: Error | null | unknown, account: string | null) => any
    //khi có thể là các type gì trong typescript thì thêm toán tử OR |
) {
    const id = setInterval(async() => {
        try {
            const accounts = await web3.eth.getAccounts();
            callback(null, accounts[0]);
        } catch(error) {
            callback(error, null);//type unknown cx có cơ. Nó còn kxđ hơn cả type undefined
        }
    }, 1000);
    
    return () => {
        clearInterval(id);
    }
    //thực tế ta vẫn cần xóa hàm interval kia 1 lúc nào đó, để làm vc đó ta có thể nhét hàm clear vào trong 
    //return là xong, khi nào gán nó vào biến r gọi biến() để xóa nếu cần, k thì thôi
}
export function subscribeToNetwork(
    web3: Web3,
    callback: (error: Error | null | unknown, netId: number | null) => any
) {
    const id = setInterval(async() => {
        try {
            const netId = await web3.eth.net.getId();
            callback(null, netId);
        } catch(error) {
            callback(error, null);
        }
    }, 1000);
    
    return () => {
        clearInterval(id);
    }
}