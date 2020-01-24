import React from 'react';
import withStyles from'@material-ui/core/styles/withStyles';
import { Avatar } from '@material-ui/core';

const style = {
    container:{
        display: "flex",
        minWidth:"10rem",
        borderBottom:"solid 0.1rem #8080803d",
        padding:"0.5rem"
    },
    avatar:{
        width:"4rem",
        height: "4rem"
    },
    content:{
        display:"flex",
        flexDirection: "column"
    },
    name:{
        fontWeight:"bold",
        margin:"1rem 1rem 0rem 0.5rem"
    },
    data:{
        margin:"0rem 1rem 1rem 0.5rem"
    },
}
const NotifCard = (props) => {
    const {classes, data: {name, content}} = props;
    return (  
        <div className={classes.container}>
            <div className={classes.img}>
            <Avatar aria-label="recipe" className={classes.avatar} src="https://cdn.dribbble.com/users/1041205/screenshots/3636353/dribbble.jpg" alt="name"/>     
            </div>
            <div className={classes.content}>
                <p className={classes.name}>{name}</p>
                <p className={classes.data}>{content}</p>
            </div>
        </div>
    );
}
 
export default withStyles(style)(NotifCard);