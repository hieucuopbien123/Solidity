class Auth {
    constructor() {
        this.authenticated = false;
    }

    login(cb) {
        this.authenticated = true;
        if(cb)
            cb();
    }
    //có thể truyền vào callback để làm gì sau khi đã authenticated, Vd tự động chuyển trang

    logout(cb) {
        this.authenticated = false;
        if(cb)
            cb();
    }

    isAuthenticated() {
        return this.authenticated;
    }
}
export default new Auth();
//điều đặc biệt là như này là nó chỉ export 1 biến duy nhất cho mọi file dùng chứ kp 
//mỗi lần import nó tạo biến mới đâu