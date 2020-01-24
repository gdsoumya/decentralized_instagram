import React from 'react';
import withStyles from'@material-ui/core/styles/withStyles';
import { Avatar, Fab } from '@material-ui/core';

const style = {
    container:{
        display: "flex",
        //width:"50%",
        padding:"0.5rem",
        margin:"0 auto",
        borderBottom: "solid 0.1rem grey"
    },
    avatar:{
        width:"8rem",
        height: "8rem"
    },
    content:{
        display:"flex",
        flexDirection: "column",
        width: "100%",
        margin:"0"
    },
    name:{
        fontWeight:"bold",
        margin:"1rem 0rem 0.5rem 0rem",
        fontSize:"1.5rem"
    },
    data:{
        display:"flex",
        margin:"0rem 1rem 1rem 0rem",
        justifyContent:"space-between",
        fontSize:"1.3rem"
    },
    title:{
        display:"flex",
        justifyContent:"space-between"
    },
    fab:{
        margin:"1rem 1rem 0.5rem 0rem",
        backgroundColor:"#ff0078",
        "&:hover":{
            backgroundColor: "#ff0078"
        }
    },
    button:{
        color:"white",
        fontWeight: "bold",
    },
    item:{
        margin:"1rem 2rem 0 0"
    }
}

const ProfileHeader = (props) => {
    // const {classes, data: {name, content}} = props;
    const {classes}=props;
    const {name, followers,following,post,account,id} = props.data;
    const followAble = !(followers.includes(account));
    return (  
        <div className={classes.container}>
            <div className={classes.img}>
            <Avatar aria-label="recipe" className={classes.avatar} src="https://cdn.dribbble.com/users/1041205/screenshots/3636353/dribbble.jpg" alt="name"/>     
            </div>
            <div className={classes.content}>
                <div className={classes.title}>
                    <p className={classes.name}>{name}</p>
                    {followAble?<Fab style={id===account?{display:"none"}:{}} variant="extended" onClick={()=>props.toggleFollow(!followAble)} className={classes.fab}><p className={classes.button}>Follow</p></Fab>:
                    <Fab style={id===account?{display:"none"}:{}} variant="extended" onClick={()=>props.toggleFollow(!followAble)} className={classes.fab}><p className={classes.button}>Unfollow</p></Fab>}
                </div>
                <div className={classes.data}>
                    <p className={classes.item}><strong>{post}</strong> posts</p>
                    <p className={classes.item}><strong>{followers.length}</strong> followers</p>
                    <p className={classes.item}><strong>{following}</strong> following</p>
                </div>
            </div>
        </div>
    );
}
 
export default withStyles(style)(ProfileHeader);