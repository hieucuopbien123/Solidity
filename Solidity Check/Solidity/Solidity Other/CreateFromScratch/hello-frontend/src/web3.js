import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider);//nếu người dùng cài metamask thì nó tự động thêm web3 vào trình duyệt
//thì mới lấy ra window.web3 được như này

export default web3;