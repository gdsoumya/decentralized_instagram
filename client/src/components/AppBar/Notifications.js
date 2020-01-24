import React from 'react';
import withStyles from'@material-ui/core/styles/withStyles';
import NotifCard from './NotifCard';

const style = {
    wrap:{
        padding:"1rem",
        fontSize:"1rem"
    }
}

const Notifications = (props) => {
    const {classes,data} = props;
    // console.log(data);
    let notifs = [];
    Object.keys(data).map(d=>notifs.push({key:d,...data[d]}))
    // console.log(notifs)
    if(notifs.length===0)
        return(
            <div className={classes.wrap}>
                No New Notification
            </div>
        )
    return (        
        <div>
            {notifs.map(d=><NotifCard key={d.key} data={d}/>)}
        </div>
    );
}
 
export default withStyles(style)(Notifications);