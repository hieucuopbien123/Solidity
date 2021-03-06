import React, { useReducer, createContext, useContext, useEffect, useMemo } from "react";
import Web3 from "web3";
import { getData, subscribeToEvent } from "../api/ContractDataAction";
import { useWeb3Context } from "./Web3";
import { SET, UPDATECONFIRM, UPDATEREVOKE, UPDATEEXECUTE, UPDATESUBMIT,
        Data as State } from "../actions/index";
import { dataContractReducer, INITIAL_STATE_DATA_CONTRACT } from "../reducers/DataContractReducer";

const ContextDataInitialization = createContext({
    state: INITIAL_STATE_DATA_CONTRACT,
    set: (data: State) => {},
    updateBalance: (data: any) => {},
    updateConfirm: (data: any) => {},
    updateRevoke: (data: any) => {},
    updateExecute: (data: any) => {},
    updateSubmit: (data: any) => {}
})
export function useContextDataInitialization(){
    return useContext(ContextDataInitialization);
}

interface Props{}
export const Provider: React.FC<Props> = ({children}) => {
    const [state, dispatch] = useReducer(dataContractReducer, INITIAL_STATE_DATA_CONTRACT);
    function set(data: State){
        dispatch({
            type: SET,
            data,
        })
    }
    function updateBalance(data: any){
        dispatch({
            type: SET,
            data,
        })
    }
    function updateConfirm(data: any){
        dispatch({
            type: UPDATECONFIRM,
            data
        })
    }
    function updateRevoke(data: any){
        dispatch({
            type: UPDATEREVOKE,
            data
        })
    }
    function updateExecute(data: any){
        dispatch({
            type: UPDATEEXECUTE,
            data
        })
    }
    function updateSubmit(data: any){
        dispatch({
            type: UPDATESUBMIT,
            data
        })
    }
    return(
        <ContextDataInitialization.Provider
            value={useMemo(
                () => ({
                    state,
                    set,
                    updateBalance,
                    updateConfirm,
                    updateRevoke,
                    updateExecute,
                    updateSubmit
                }),[state]
            )}
        >
            {children}
        </ContextDataInitialization.Provider>
    )
//ta cho d??? li???u ch??? ?????i khi ta state ?????i. D??? li???u ?????i khi: ng?????i d??ng b???m v??o n??t n??o l??m n?? ?????i, or t???o trans
//v?? sau khi mined th?? blockchain c?? state m???i. Ta b???t c??i th??? 2 b???ng subscribe event. C??n c??i th??? nh???t th?? k x???y
//ra v?? ta ch??? ???n c??i g?? l??m cho n?? ?????i ngay ???????c
}
//k c???n l???y children th?? k c???n React.FC
export function Updater(){
    const {
        state
    } = useWeb3Context();
    const {
        state: {address},
        set,
        updateBalance,
        updateConfirm,
        updateRevoke,
        updateExecute,
        updateSubmit
    } = useContextDataInitialization();
    useEffect(() =>{//b???t c??? khi n??o c?? kh??? n??ng c?? l???i th?? ?????u d??ng try catch
        async function get(web3: Web3, account: string) {
            try{
                const data: State = await getData(web3, account);
                console.log(data);
                set(data);
            }catch(error){
                console.log(error);
            }
        }
        if(state.web3){
            get(state.web3, state.account);
        }
        //th???t ra c?? ph??p n??y l?? b???t bu???c. useEffect ch??? nh???n h??m synch. m?? ta c???n g???i getData l?? 1 h??m async
        //(k d??ng promise) th?? ta ph???i bao n?? b???ng 1 h??m async v?? await n?? n??n c???u tr??c tr??n l?? ch???t lu??n r
    },[state])
    //bi???n web3 c?? th??? coi l?? l??u tr???ng th??i ????ng nh???p metamask v, ??? ????y m???i l???n web3 ?????i l?? m???i th??? render l???i
    //hay ng?????i d??ng ????ng nh???p v??o metamask l?? check or ?????i sang m???ng kh??c cx check
    //bi???n web3 ?????i b???t c??? khi n??o ta d??ng window.ethereum.enable, t???c l?? ta ???n n??t connect b???t c??? l??c n??o cx l??m
    //bi???n web3 ?????i d?? n?? v???n l?? ch??nh n??-> n?? ng???t c???c nhanh v?? connect l???i ????
    useEffect(() => {
        if(state.web3 && address != "0x00"){
            return subscribeToEvent(state.web3, address, (error, log) => {
                console.log("abc");
                if(error){
                    console.log(error);
                }else if(log){
                    switch (log.event){
                        case "Deposit":{
                            console.log("Log: ", log);
                            updateBalance(log.returnValues);
                            break;
                        }
                        case "ConfirmTransaction":{
                            //kp l??c n??o cx l???y m???i gi?? tr??? in ra c???a event. Khi ?? n??y x??c nh???n th?? ph???i tr???
                            //ra r???ng ?? n??y ???? confirm r, tr??? ra s??? l?????ng confirmation of transaction ???? c??
                            console.log("Log: ", log);
                            const data = { 
                                //B???i v?? ng?????i kh??c confirm th?? c??i n??y c??ng b???t nh??ng kp account n??y confirm 
                                //n??n ph???i check ??i???u ????
                                confirmed: state.account == log.returnValues.owner,
                                txIndex: log.returnValues.txIndex
                                //numConfirmation ta t??? c???ng 1, kp truy???n
                            }
                            updateConfirm(data);
                            break;
                        }
                        case "RevokeConfirmation":{
                            console.log("Log: ", log);
                            const data = { 
                                confirmed: state.account == log.returnValues.owner,
                                txIndex: log.returnValues.txIndex
                            }
                            updateRevoke(data);
                            break;
                        }
                        case "ExecuteTransaction":{
                            console.log("Log: ", log);
                            const data = { 
                                txIndex: log.returnValues.txIndex
                            }
                            updateExecute(data);
                            break;
                        }
                        case "SubmitTransaction":{
                            console.log("LOG: ", log);
                            const data = {
                                ...log.returnValues,
                                value: Web3.utils.toBN(log.returnValues.value),
                                //event uint n?? l???i tr??? ra string m?? type Action c?? Transaction l?? BN kh??c g??y l???i
                            }
                            updateSubmit(data);
                            break;
                        }
                        default: 
                            console.log(log);
                    }
                }
            });
        }
    },[state.web3, address]);//n?? ch??? ch???y l???i n???u ?????a ch??? contract, web3 ?????i m???ng kh??c m?? th??i v?? subscribe theo account
    return null;
}