import React from "react";
import {BrowserRouter, Link, Routes, Route} from "react-router-dom";

const Home = () => {
    // const match = useRouteMatch();//v6 k còn
    // console.log(match)
    return(
        <div>Home</div>
    )
}
function About() {
    return (
        <div>About</div>
    )
}
function Test(){
    return (
        <div>Test</div>
    )
}
function Users() {
    //Khi dùng react để có biến match thì phải dùng useRouteMatch nhưng giờ k còn nx
    // k cần dùng match để lấy id nx mà có thể dẫn tiếp với path=":id" luôn
    //đồng thời ta cx k cần dùng match.url hay path nx mà nó tự hiểu là có sẵn ở dưới path là
    //"/users/" sẵn rồi. Nó tự xây path tiếp từ cha
    return (
        <div>
            <nav>
                <Link to="me">My Profile</Link>
            </nav>
            <Routes>
                <Route path=":id" element={<Test />} />
                <Route path="me" element={<About />} />
            </Routes>
        </div>
    );
}
const RouterAll = () => {
    return (
        <BrowserRouter>
        {/* Thay thế Switch bằng Routes có nhiều tính năng hơn:
        Routes sẽ chọn cái Route đúng nhất chứ k check từ trên xuống dưới như Switch thì khi gặp cái hợp lý 
        nó sẽ dừng luôn thì những component phía sau cần render lại k được render */}
            <Routes>
                {/* Route children chuyển thành Route element */}
                <Route path="/" element={<Home />} />
                <Route path="users/*" element={<Users />} />
                {/* K còn Route exact nữa, nếu muốn bất kỳ thì phải dùng thêm * */}
            </Routes>
        </BrowserRouter>
    );
}

export default RouterAll;