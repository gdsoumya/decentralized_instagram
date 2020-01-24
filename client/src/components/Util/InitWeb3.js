import React, { Component } from 'react';
import InstaContract from "../../contracts/InstaContract.json";
import getWeb3 from "../../getWeb3";
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import { CircularProgress, TextField, Button } from '@material-ui/core';

const style={
    Fab:{
        backgroundColor: "#009fff",
        fontWeight: "bold",
        color:"white",
        '&:hover':{
            backgroundColor: "#00Bfff"
        }
    },
    title:{
        textAlign: "center",
        fontSize: "2.4rem"
    },
    container:{
        textAlign:"center",
        display:"flex",
        flexDirection:"column",
        height:"100vh"
    },
    grow:{
        flex:0.4
    },
    loader:{
        width:"5rem !important",
        height:"5rem !important"
    },
    msg:{
        fontSize:"2rem"
    },
    form:{
        width: "fit-content",
        margin: "0 auto",
        background:"#bdbbbb42",
        padding: "2rem",
        borderRadius: "1rem"
    },
    submit:{
        margin:"2rem 0rem 0rem 0rem"
    }
};

class InitWeb3 extends Component {
    state = {
        loading:false,
        loadMessage:"",
        error:"",
        regiter:false,
        web3:null,
        account:null,
        contract:null
    }
    init = async ()=>{
        this.setState({loading:true,loadMessage:"...Connecting to Network..."})
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = InstaContract.networks[networkId];
            //console.log("hello",networkId);
            const instance = new web3.eth.Contract(
              InstaContract.abi,
              deployedNetwork && deployedNetwork.address,
            );
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({loadMessage:"...Fetching User Data...",web3:web3,account:accounts[0],contract:instance});
            await this.fetchUser();
          } catch (error) {
            this.setState({error:error.message?error.message:error, loading:false})
            alert(
              error.message?error.message:error
            );
            // console.error(error);
          }
    }
    fetchUser=async ()=>{
        const {web3, account,contract} = this.state;
        try{
            const res = await contract.methods.getUser(account).call();
            if(res[2]===account)
                this.props.setWeb3(web3, account, contract);
        }
        catch(error){
            console.log(error.message);
            this.setState({register:true,loading:false})
        }
    }
    welcome=()=>{
        const {classes} = this.props;
        // const {loading, loadMessage} = this.state;
        return(
            <div>
                <h2 className={classes.title}>Welcome to the Future! Your ride to the Decentralized World is here.<br/>Please Connect to the Ethereum Network to continue..</h2>
                <Fab onClick={this.init} variant="extended" className={classes.Fab}>Connect To Network</Fab>
            </div>
        );
    }
    loader=()=>{
        const {classes} = this.props;
        const {loadMessage} = this.state;
        return(
                <div>
                    <CircularProgress className={classes.loader}/>
                    <p className={classes.msg}>{loadMessage}</p>
                </div>
        )
    }
    register=()=>{
        const {classes} = this.props;
        return(
            <div>
                <p className={classes.msg}>You haven't registered yet!<br/>Please register to continue..</p>
                <form className={classes.form} onSubmit={this.registerUser}>
                    <TextField id="uname" label="username" /><br/>
                    <Button className={classes.submit} variant="contained" type="submit" color="primary">Submit</Button>
                </form> 
            </div>
        )
    }
    registerUser=async (event)=>{
        event.preventDefault();
        const {web3, account,contract} = this.state;
        this.setState({loading:true,loadMessage:"...Registering User...",register:false})
        const uname = event.target.uname.value;
        try{
            const user=await contract.methods.userMap(uname).call();
            //console.log(user)
            if(user && user!=="0x0000000000000000000000000000000000000000"){
                alert("Username Taken");
                this.setState({loading:false,register:true,error:"Username Taken"})
                return;
            }
            await contract.methods.regUser(uname).send({from:account})
            const res = await contract.methods.getUser(account).call();
            if(res[2]===account)
                this.props.setWeb3(web3, account, contract);
            
        }
        catch(error){
            this.setState({loading:false,error:error.message})
        }

    }
    error=()=>{
        const {classes} = this.props;
        return(
            <p className={classes.msg}>An error has occured!<br/>{this.state.error}</p>
        )
    }
    render(){
        const {classes} = this.props;
        const {loading,register,error} = this.state;
        let output=""
        if(loading){
            output = this.loader();
        }
        else if(register)
            output=this.register();
        else if(error)
            output = this.error();
        else
            output = this.welcome();
        return(
            <div className={classes.container}>
                <div className={classes.grow}></div>
                {output}
                <div className={classes.grow}></div>
            </div>
        )
    }
}
 
export default withStyles(style)(InitWeb3);