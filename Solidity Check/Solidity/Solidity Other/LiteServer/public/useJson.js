//Để fetch API trong javascript-> big problems. Trước tiên ta cần xét file javascript của ta dùng để làm gì?
//nếu file javascript của ta dùng cho front end thì phải xác định có file html-> dùng hàm fetch bth và chạy bằng
//file html đó, sẽ fetch được và console.log response xem trên extension của trình duyệt. 
//nếu file js dùng cho backend nodejs-> thì phải cài module node-fetch@2.0 sau đó dùng
//const fetch require("node-fetch"); mới dùng fetch được
//Bản chất-> fetch là 1 hàm thuộc về web API chứ kp của bản thân server hay client gì cả. Nếu ta chạy client 
//k dùng trình duyệt mà dùng cái gì khác k hỗ trợ WebAPI thì sẽ k hoạt động
//Do đó ta fetch ở react app của nodejs, fetch ở file js xong chạy file html thì đều fetch được, nhưng ở mọi file
//js bth ta chạy node <tên file>.js đều k được, là vì ta k dùng đến trình duyệt nên k bản thân nodejs k có sẵn
//webAPI như browser nên k dùng được fetch. Cụ thể chạy file đó k tương tác gì với trình duyệt do đó là cách chạy
//1 file server chỉ hiện ở console. Ở react-app tạo bởi nodejs lại chạy được vì vẫn bật trên trình duyệt mà, chứ 
//chạy node <file đó> thì vẫn k đc thôi. Do đó muốn fetch mà k tác động tới trình duyệt thì install node-fetch
//or dùng các module thư viện khác như axios

//Khi ta chạy live-server thì thực chất nó dựng 1 server ảo ở port 5500 tâng dần lên. server này chỉ GET 
//được từ cây thư mục gốc. Khi đó, mọi file .json đều được coi là 1 json-server và ta có thể GET server
//đó như dưới
//curl -X GET "http://127.0.0.1:5500/LiteServer/public/data.json"
//File .json cx hoạt động khi ta mở file đó bằng trình duyệt, lấy nó như thế này
//curl -X GET "file:///B:/Solidity/Solidity%20Other/LiteServer/public/data.json" => uri mở bằng browser
//máy của ta lúc này như 1 browser còn trình duyệt như 1 client v nhưng chỉ có điều k dùng http request

fetch('./sontung.jpg').then(res => console.log(res));//miễn tương tác với trình duyệt là dùng đc fetch

//Để lấy dữ liệu của file json, nếu từ xa thì ta fetch đến file json đó.
//Để lấy file json local dùng trong dự án, ta có thể dùng hàm getJSON của jquery, nó đọc đọc file json như bth
//Để dùng với javascript với client: C1: fetch đến file data.json đó sau đó chạy bằng trình duyệt là đc
//C2:cdn cái axios để GET đến file data.json đó éo cần dùng trình duyệt
//C3:lưu data json dưới dạng string trong js vào 1 biến r script tới cả file đó nx. Sau đó lấy ra bằng JSON.parse
//và JSON.stringify để gán lại nó thế là vẫn đọc vẫn update data như bth. Nhưng nó sẽ restart sau mỗi lần thao
//tác vì vc thay đổi biến này k làm thay đổi database dữ liệu thực. Tốt nhất là fetch có GET POST để thêm dữ liệu
//Để dùng với js server: C1: dùng module fs để read file như read file bth r JSON parse nó
//C2: dùng const data = require("./data.json"); nhưng có cách này lưu vào 1 biến nên k write đc

data = JSON.parse(data);
console.log(data);