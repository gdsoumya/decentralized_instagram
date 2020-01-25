import React, { useEffect } from 'react';
import FeedPost from './FeedPost.js';
import { CircularProgress } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container:{
        minHeight:"100vh"
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
    },
    info:{
        textAlign:"center",
        fontSize: "2rem",
        margin: "30vh"
    },
    newPost:{
        backgroundColor:"#0e61ff",
        border: "none",
        padding: "0.4rem 0.8rem",
        borderRadius: "1rem",
        color:"white",
        display: "block",
        zIndex: 2,
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: "1rem",
        fontWeight: "bold",
        cursor: "pointer"
    }
}))

export default function Feed(props) {

    const [data, setData] = React.useState(null);
    const [following, setFollowing] = React.useState(null);
    const {account,contract} = props.data;
    const [newPost,setNewPost] = React.useState([]);
    const classes = useStyles();
    let blocks=[]
    useEffect(() => {
        window.scrollTo(0, 0)
        const hello = async () => {
            let p=[]
            const follow = await contract.methods.getFollowing(account).call();
            for(let i=0;i<follow.length;i++){
                let user = await contract.methods.getUser(follow[i]).call()
                let posts = await contract.methods.getAllPost(follow[i]).call();
                for(let j=1;j<posts[0].length;j++){
                    p.push({
                        acc:follow[i],
                        id:j,
                        name:user[1],
                        content:posts[0][j],
                        img:posts[1][j]
                    })
                }
            }
            if(p.length!==0)
                setData(p);
            else
                setData("");
            setFollowing(follow);
        }
        contract.events.NewPost({
            filter:{author: following},
            fromBlock:'latest'
          })
          .on('data',function(event){
            if(blocks.includes(event.blockNumber))
                return;
            blocks.push(event.blockNumber);
            let p=[...newPost]
            contract.methods.getUser(event.returnValues.author).call().then(user=>{
                contract.methods.getPost(event.returnValues.author,event.returnValues.id).call().then(post=>{
                    p.push({
                        acc:user[0],
                        id:event.returnValues.id,
                        name:user[1],
                        content:post[0],
                        img:post[1]
                    })
                    setNewPost(p)
                })
          })
        })
        hello();
    },[])

    const loader=()=>{
        return(
                <div className={classes.load}>
                    <CircularProgress className={classes.loader}/>
                    <p className={classes.msg}>...Loading Feed...</p>
                </div>
        )
    }
    const refresh=()=>{
        // console.log("here",newPost)
        let p=[...data]
        for(let i=0;i<newPost.length;i++){
            p.push(newPost[i])
        }
        // console.log(p);
        setData(p);
        // console.log(data)
        setNewPost([]);
    }
    if(data==null)
        return loader();
    else if(data==="")
            return(
            <div className={classes.container}>
                <button style={{display:newPost.length?"block":"none"}} onClick={refresh} className={classes.newPost}>New Posts</button>
                <p className={classes.info}>No Feed Found<br/>Follow Others To view their Posts</p>
            </div>
        )
    else{
        const feed = [...data]
        feed.reverse()
        return (
            <div className={classes.container}>
                <button style={{display:newPost.length?"block":"none"}} onClick={refresh} className={classes.newPost}>New Post</button>
                {feed.map(d=><FeedPost key={`${d.acc}_${d.id}`}contract={contract} account={account} data={d}/>)}
            </div>
        )
    }
    
}