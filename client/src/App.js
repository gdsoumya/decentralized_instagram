import React, { Component } from "react";
import "./App.css";
import InitWeb3 from "./components/Util/InitWeb3.js";
import withStyles from '@material-ui/core/styles/withStyles';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Profile from "./components/Profile/Profile";
import Appbar from "./components/AppBar/Appbar";
import Feed from "./components/Feed/Feed";

const style={
  container:{
      display: "flex",
      backgroundColor:"#eeeeee50",
      paddingTop: "5rem"
  },
  grow:{
      flexGrow:1
  }
}

class App extends Component {
  state = { storageValue: 0, web3: null, account: null, contract: null };

  componentDidMount = async () => {
    try{
      window.ethereum.on('accountsChanged', (accounts) =>{
        this.setState({web3:null});
        //console.log("Updated")
      })
    }
    catch(error){
      console.log(error)
    }
  };

  setWeb3 = (web3, account, contract)=>{
    this.setState({web3, account, contract});
  }

  render() {
    const {classes} = this.props; 
    const {web3, account, contract} = this.state;
    if(!web3)
      return (
        <div className="App">
              <InitWeb3 setWeb3={this.setWeb3}/>
        </div>
      );
    return(
      <Router>
        <div className="App">
        <Appbar data={{account,contract}}/>
        <div className={classes.container}>
                <div className={classes.grow}></div>
        <Switch>
          <Route exact path="/">
            <Feed data={{account,contract}}/>
          </Route>
          <Route exact path="/profile/:id">
            <Profile data={{account,contract}}/>
          </Route>
        </Switch>
        <div className={classes.grow}></div>
        </div>
        </div>
    </Router>
    )
    
  }
}

export default withStyles(style)(App);
