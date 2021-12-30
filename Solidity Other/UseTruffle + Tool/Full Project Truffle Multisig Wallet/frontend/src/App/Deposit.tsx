import { Button } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../utils/useAsync";
import { depositContract } from "../api/ContractDataAction";
import { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";

interface DepositParam{
    web3: Web3,
    account: string,
    value: BN
}

function Deposit() {
    const {
        state: { web3, account }
    } = useWeb3Context();
    const [input, setInput] = useState("");
    //Tại sao deposit thì useAsync phải xác định 2 generic còn connect thì k?
    //Bởi vì hàm depositContract có tham số còn 
    const { pending, call } = useAsync<DepositParam, void>(
        ({web3, account, value}) => depositContract(web3, account, value)
    );
    async function deposit() {
        if(web3){
            //trong typesccript nó kiểm tra type rất chặt,nên phải có check web3 ở đây tránh Th nó null báo lỗi
            const value = Web3.utils.toBN(input);//k có util này của web3 thì phiền phức đấy
            //ta phải check đủ loại khi dùng bất cứ số nào
            if(value.gt(Web3.utils.toBN(0))){//chú ý làm việc với BN phải chuyển hết sang BN, nó cung các hàm 
                //riêng cho kiểu BN như so sánh lt, gt
                const {error} = await call({ web3, account, value} )
                if(error)
                    console.log(error);
                else{
                    setInput("");
                    //k gọi được window.ethereum ở đây mà chỉ gọi được trong file ts
                    //để balanceUpdate ta k thể gọi ở đây được mà phải subcribe event, ta muốn là k chỉ người này dùng
                    //mà những người khac gửi tiền vào contract thì người này cx thấy số dư contract tăng cơ
                }
            }
        }
    }
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }
    return (
        <div>
            <div className="ui input focus" style={{width: "100%"}}>
                <input type="text" placeholder="Deposit in wei" value={input} 
                    onChange={onChange}/>
                <Button color="green" onClick={() => deposit()} 
                    disabled={pending} loading={pending}>Deposit</Button>
            </div>
        </div>
    )
}
export default Deposit;