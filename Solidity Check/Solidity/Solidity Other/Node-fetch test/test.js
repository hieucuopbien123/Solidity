const fetch = require('node-fetch');
async function test() {
    const response = await fetch('https://google.com/');
    const body = await response.text();
    console.log(body);
    ///ở đây dù chạy node test.js vẫn fetch đc
}
test();

const data = require("./data.json");
console.log(data);