import React from 'react';
import withStyles from'@material-ui/core/styles/withStyles';

const style = {
    posts:{
        display: "flex",
        // padding:"0.5rem",
        // flexDirection:"column"
        // margin:"0 auto",
        flexWrap:"wrap",
        justifyContent:"center"
    },
    container:{
        textAlign:"center",
        width:"70%",
        margin:"0 auto",
        height: "100vh"
    },
    image:{
        maxWidth: "300px",
        maxheight:" 300px",
        display:"block",
        overflow:"hidden",
        margin:"0.3rem",
    },
    img :{
        width: "100%",
        height: "100%",
        position: "relative",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)"
    },
    msg:{
        fontSize:"1.6rem"
    }

}
const ProfilePosts = (props) => {
    const {classes,post} = props
    let output = post[1].length===1?<p className={classes.msg}>No Posts Yets</p>:post[1].map(p=>p!==""?<div key={p} className={classes.image}><img className={classes.img} src={`https://ipfs.infura.io/ipfs/${p}`} alt={`post${p}`}/></div>:"");
    return (  
        <div className={classes.container}>
            <h3>POSTS</h3>
            <div className={classes.posts}>
                {output}
            </div>
        </div>
    );
}
 
export default withStyles(style)(ProfilePosts);