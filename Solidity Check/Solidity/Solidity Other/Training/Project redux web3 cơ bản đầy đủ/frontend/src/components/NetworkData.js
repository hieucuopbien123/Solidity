import { Typography } from "@material-ui/core";

function NetworkData(props){
    // console.log(props);
    // console.log('Render network')
    // console.log(props.netId);
    function getNetwork(props) {
        // console.log("Run inside");
        switch (parseInt(props.netId)) {//đù má nó ra hex
            case 1:
                return "Mainnet";
            case 2:
                return "Morden test network";
            case 3:
                // console.log("Run to case3")
                return "Ropsten network";
            case 4:
                return "Rinkeby test network";
            case 42:
                return "Kovan test network";
            case 56:
                return "BSC Network"
            default:
                console.log("Run to default")
                return "Local network";
        }
    }
    return(
        <div>
            <Typography variant="h5" style={{color: "white"}}>Address: {props.address}</Typography>
            <Typography variant="h5" style={{color: "white"}}>Blockchain Network: {getNetwork(props)}</Typography>
            {
                (props.netId !=  3 && props.netId != 4) ?
                <Typography variant="h5" style={{color: "white"}}>You must switch to Ropsten Network or Rinkeby Network to interact
                with contract</Typography>
                : null
            }
            <br></br>
        </div>
    )
}

export default NetworkData;