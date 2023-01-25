import logo from './logo.svg';
import './App.css';
import { init, mintToken, getOwnBalance } from './Web3Client';
import { useEffect, useState } from "react";

// ở đây để giảm tải sự phức tạp ta sẽ k chạy contract thực mà chỉ viết front end này k thể chạy đươc.
// Qtr là học được gì thôi
function App() {
  // const providerUrl = process.env.PROVIDER_URL || "http://localhost:8545";
  //cái trên là provider k có account nào cả, ta dùng window.ethereum là provider gắn với account
  useEffect(() => {
    init();
  },[])
  //test tính năng mint-> k áp dụng thực tế vì ở đây nếu user refresh trang thì sẽ mint được tiếp vô hạn
  const [minted, setMinted] = useState(false);
  const mint = () => {
    mintToken().then((tx) => {
      console.log(tx);
      setMinted(true);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const [balance, setBalance] = useState(0);
  const fetchBalance = () => {
		getOwnBalance()
			.then((balance) => {
				setBalance(balance);
			})
			.catch((err) => {
				console.log(err);
			});
	};

  return (
    <div className="App">
      {!minted ? (
        <button onClick={() => mint()}>Mint Token</button>
      ) : (
        <p>Token minted successfully</p>
      )}
      <p>Your balance is {balance}</p>
			<button onClick={() => fetchBalance()}>Refresh balance</button>
    </div>
  );
}

export default App;
