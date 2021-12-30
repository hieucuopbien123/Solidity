import React from "react";
import {BrowserRouter, Link, Routes, Route, Outlet, useParams, useLocation, useNavigate, Navigate} from "react-router-dom";
import auth from "./auth";

const Home = () => {
    console.log("Home")
    let navigate = useNavigate();
    function handleClick(){
        navigate("/users");
    }
    function login(){
        auth.login(null);
    }
    return(
        <div>
            <div onClick={handleClick}>Access to User</div>
            <div onClick={login}>Login</div>
        </div>
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
//Navigate chỉ cần biết trong tổng thể bên ngoài nó có 1 thẻ Router bao thôi, nên bên ngoài User có Router bao rồi
//thì dùng thoải mái
function Users(props) {
    return (
        <div>
            <nav>
                <Link to="me">My Profile: {props.color}</Link>
            </nav>
            <Outlet/>
        </div>
    );
}

//Code mẫu redirect sang trang nào or render component nào. VD ở đây user được bảo vệ chỉ khi nào có auth mới vô đc
function CheckForRender({properties}){
    return (
        <div>
            {auth.isAuthenticated() ? properties.Comp : <Navigate to={properties.path}/>}
        </div>
    )
}

const RouterAll2 = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={"/home"} replace/>}/>
                <Route path="/home" element={(<Home />)}/>
                {/* <Route path="/users" element={auth.isAuthenticated() 
                    ? <Users name={console.log("usser")} /> 
                    : <Navigate to={"/home"} replace name={console.log("Home nef")}/>}> 
                    Dùng như này là sai vì Route nó tính toán luôn tại thời điểm này để biết render ra component nào
                    chứ k chạy lại đâu nên tốt hơn là render ra 1 component và check trong component đó thì mỗi
                    lần chạy route sẽ gọi lại component đó chứ nó k chạy lại logic trong thuộc tính element*/}
                {/* <Route path="/users" element={<Users />}> */}
                <Route path="/users" element={<CheckForRender properties={{
                    path: "/",
                    Comp: <Users color="red"/>
                }} />}>
                    <Route path="me" element={<Test />} />
                    <Route path=":id" element={<About />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default RouterAll2;
//Tình huống: ta muốn là phải đăng nhập thì mới đi truy cập được vào link user
//Do thường dùng kiểu Route ở bất cứ đâu nên nó còn cho BrowserRouter bao luôn component App trong index.js cơ

//Để đánh dấu đã login thì mới được truy cập user thì ta k thể cho user check nếu chưa login thì navigate đến home được
//NN là vì navigate nó k hoạt động nếu component hiện tại chưa render xong => nên lần đầu tiên nó đi qua navigate mà chả
//làm gì cả. Nhưng nếu dùng Navigate thì khác vì nó là 1 component rendering=> nếu render đến nó sẽ tự động chuyển
//Nhưng cần tránh navigate đến 1 trang navigate kẻo vô tận
//Ở đây ta thử Wrap nó làm 1 componen chung xem