import React, { Component } from 'react';
import ProfileHeader from './ProfileHeader';
import withStyles from'@material-ui/core/styles/withStyles';
import Posts from './ProfilePosts';
import { withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';


const style = {
    container:{
        display: "flex",
        minWidth:"70%",
        padding:"0.5rem",
        flexDirection:"column"
    },
    load:{
        height:"100vh",
        textAlign:"center"
    },
    loader:{
        marginTop:"40%",
        width:"5rem !important",
        height:"5rem !important"
    },
    msg:{
        fontSize:"2rem"
    }
}
class Profile extends Component {
    state = {
        id:null,
        uname:null,
        followers:null,
        following:null,
        posts:[],
    }
    
    constructor(props){
        super(props);
        this.blocks=[""];
        this.account = this.props.data.account;
        this.contract = this.props.data.contract;
        this.getUserData(this.props.match.params.id);
    }
    componentDidMount() {
        console.log(this.state.posts)
        window.scrollTo(0, 0);
        this.contract.events.NewPost({
            filter:{author: [this.props.match.params.id]},
            fromBlock:'latest'
          })
          .on('data',(event)=>{
            if(this.blocks.includes(event.blockNumber))
                return;
            this.blocks.push(event.blockNumber);
            console.log(this.state.posts)
            let p=this.state.posts;
            this.contract.methods.getPost(event.returnValues.author,event.returnValues.id).call().then(post=>{
                p[0].push(post[0]);
                p[1].push(post[1]);
                this.setState({posts:p});
            })
        })

    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps.match.params.id !== this.props.match.params.id)
            this.getUserData(nextProps.match.params.id);
     }
    getUserData= async(id)=>{
        this.setState({id:null,uname:null,followers:null,following:null,posts:[]});
        const name = await this.contract.methods.getUser(id).call();
        const followers = await this.contract.methods.getFollowers(id).call();
        const following = await this.contract.methods.getFollowing(id).call();
        const posts = await this.contract.methods.getAllPost(id).call();
        this.setState({id:id,uname:name[1],followers:followers,following:following,posts:posts});
    }
    loader=()=>{
        const {classes} = this.props;
        return(
                <div className={classes.load}>
                    <CircularProgress className={classes.loader}/>
                    <p className={classes.msg}>...Loading Profile...</p>
                </div>
        )
    }
    toggleFollow=(follow)=>{
        //console.log("clicked",this.state.followers, this.account)
        if(follow){
            this.contract.methods.unFollow(this.state.id).send({from:this.account}).then(()=>this.getUserData(this.state.id))

        }
        else{
            this.contract.methods.follow(this.state.id).send({from:this.account}).then(()=>this.getUserData(this.state.id))
        }
    }
    render() { 
        const {classes} = this.props
        const {uname, followers,following,posts} = this.state;
        if(!uname){ 
            return this.loader();
        }
        return (
            <div className={classes.container}>
            <ProfileHeader toggleFollow={this.toggleFollow} data={{name:uname,followers:followers,following:following.length,post:posts[0].length-1,account:this.account,id:this.state.id}}/>
            <Posts post={posts}/>
            </div>
        );
    }
}
 
export default withStyles(style)(withRouter(Profile));