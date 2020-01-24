import React, { useEffect } from 'react';
import {fade,makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountBox';
import NotificationsIcon from '@material-ui/icons/Favorite';
import AppIcon from '../../images/insta.png';
import Popover from '@material-ui/core/Popover';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import BackupIcon from '@material-ui/icons/Backup';
import { TextareaAutosize, Snackbar } from '@material-ui/core';
import Notifications from './Notifications';
import { Link } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
const ipfsClient = require('ipfs-http-client')

const useStyles = makeStyles(theme => ({
  appBar:{
    backgroundColor: "white",
    color: "black",
    margin: "0"
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    // marginRight: theme.spacing(2),
    marginLeft: "0 !important",
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    backgroundColor:"#e3dbdb70"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  text: {
    textAlign:"center",
    display:"block",
    minWidth:"30vw"
  },
  sectionDesktop: {
    display: 'flex',
  },
  icon:{
    fontSize: "1.8rem",
    padding: "0px 0.2rem"
  },
  button: {
    margin: theme.spacing(1),
  },
  container:{
    width: "70%",
    margin: "0 auto",
    textAlign: "center",
    padding:"0 0 1rem 0"
  },
  textArea:{
    width: "90%",
    margin: "1rem auto 0.5rem auto",
    borderRadius: "0.4rem",
    padding: "0.6rem",
    borderStyle: "solid"
  },
  modal:{
    minWidth: "30%",
    display:"block"
  },
  pop:{
    padding:"1rem"
  },
  info:{
    backgroundColor:"#00abff",
    textAlign:"center",
    padding: "1rem",
    color:"white",
    fontWeight: "bold",
    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
  },
  success:{
    backgroundColor:"yellowgreen",
    textAlign:"center",
    padding: "1rem",
    color:"white",
    fontWeight: "bold",
    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
  },
  dropdown:{
    position: "relative",
    display: "inline-block"
  },
  dropdownContent:{
    // display: "none",
    position: "absolute",
    backgroundColor: "#f9f9f9",
    minWidth: "100%",
    margin:"0 auto",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    padding: "12px 16px",
    zIndex: 1,
    boxSizing:"border-box"
  }
}));

export default function Appbar(props) {
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setCount(0);
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setUpload("upload");
    
  };
  const handleSearch=(event)=>{
    event.preventDefault()
    const value = event.target.value;
    // console.log(value)
    if(value==="")
      setSearch(null);
    else
      contract.methods.userMap(value).call().then(res=>{
        // console.log(res)
        if(res && res!=="0x0000000000000000000000000000000000000000")
            setSearch(<Link onClick={()=>setFocus(false)} className={classes.searchRes} to={`/profile/${res}`}>{value}</Link>)
        else
          setSearch(<p className={classes.searchRes}>No such user found</p>)
      });
  }
  const newPost = () => {
    setOpen(false);
    setUpload("upload");
    setOpenSI(true)
    const file = document.getElementById("post");
    const caption= document.getElementById("caption").value
    ipfs.add([...file.files], {})
      .then((response) => {
        let ipfsId = response[0].hash
        contract.methods.post(caption,ipfsId).send({from:account})
        .then(()=>{setOpenSI(false);setOpenSS(true)})
      }).catch((err) => {
        console.error(err)
      })

    
  };
  const check = (event)=>{
    if(event.target.files.length >0)
      setUpload("selected");
  }
  const modal=()=>{
    return(
      <Dialog open={openM} onClose={handleModalClose} maxWidth="xl" aria-labelledby="form-dialog-title">
        <DialogTitle className={classes.text} id="form-dialog-title">Create New Post</DialogTitle>
        <div className={classes.container}>
          <DialogContent>
            {/* <DialogContentText>
              Upload your new snaps and give them a catchy caption and share it with the world!
            </DialogContentText> */}
            <input
              accept="image/*"
              className={classes.input}
              style={{ display: 'none' }}
              id="post"
              onChange={check}
              // multiple
              type="file"
            />
            <label htmlFor="post">
            <Button
          variant="contained"
          color="secondary"
          style={upload==='selected'?{backgroundColor:"yellowgreen"}:{}}
          component="span"
          startIcon={<BackupIcon />}
        >
          {upload}
        </Button></label><br/>
        <TextareaAutosize id="caption" rowsMin={3} rowsMax={3} className={classes.textArea} name="caption" aria-label="caption" placeholder="Enter Caption" />
          </DialogContent>
        <Button onClick={newPost} color="primary" variant="contained">
          Post
        </Button>
        </div>
      </Dialog>
    )
  }

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openM, setOpen] = React.useState(false);
  const [notif, setNotif] =React.useState({});
  const open = Boolean(anchorEl);
  const {account,contract} = props.data;
  const [count, setCount] = React.useState(0);
  const [upload, setUpload] = React.useState("upload");
  let blocks =[], resFocus=false;
  const [ipfs,setIpfs] = React.useState(null);
  const [openSS, setOpenSS] = React.useState(false);
  const [openSI, setOpenSI] = React.useState(false);
  const [search, setSearch] = React.useState(null);
  const [focus, setFocus] = React.useState(null);

  const handleCloseS = (event, reason) => {
    setOpenSS(false);
    setOpenSI(false);
  };

  useEffect(() => {
    setIpfs(ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' }))
    contract.events.NewFollower({
      filter:{target: [account]},
      fromBlock:'latest'
    })
    .on('data',function(event){
      // console.log(event.blockNumber)
      if(blocks.includes(event.blockNumber))
        return;
      blocks.push(event.blockNumber);
      // console.log("Notif recieved")
      let n = notif;
      contract.methods.getUser(event.returnValues.src).call().then(res=>{
        n[event.blockNumber]={
          name:res[1],
          content:"started following you"};
        setNotif(n);
        setCount(count+1);
        // console.log("updated",event)
      })
    });
    contract.events.NewLike({
      filter:{author: [account]}
    })
    .on('data',function(event){
      if(blocks.includes(event.blockNumber))
        return;
      blocks.push(event.blockNumber);
      let n = notif;
      contract.methods.getUser(event.returnValues.src).call().then(res=>{
        n[event.blockNumber]={name:res[1],
          content:"liked your post"};
        setNotif(n);
        setCount(count+1);
        // console.log("updated 1",notif)
      })
    })
  }, []);

  return (
    <div className={classes.grow}>
      <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        key="info"
        open={openSI}
        onClose={handleCloseS}
        message=""
      >
        <p className={classes.info}>Your post is being uploaded!</p>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        key="success"
        open={openSS}
        onClose={handleCloseS}
      >
        <p className={classes.success}>Post uploaded succesfully</p>
      </Snackbar>
      {modal()}
      <AppBar className={classes.appBar}>
        <Toolbar>
          <div className={classes.grow} />
          <Link to="/"><img src={AppIcon} alt="instagram logo"/></Link>
          <div className={classes.grow} />
          <div className={classes.dropdown}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={handleSearch}
              onFocus={()=>setFocus(true)}
              onBlur={()=>{!resFocus?setFocus(false):setFocus(true)}}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
            </div>
            <div onMouseEnter={()=>{resFocus=true}} onMouseLeave={()=>{resFocus=false;}} style={!(search&&focus)?{display:"none"}:{}} className={classes.dropdownContent} tabIndex={0}>
              {search}
            </div>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {/* <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton> */}
            <IconButton aria-label="create new post" color="inherit" onClick={handleClickOpen}>
              <AddAPhotoIcon className={classes.icon}/>
            </IconButton>
            <IconButton aria-label="show new notifications" color="inherit" onClick={handleClick}>
              <Badge badgeContent={count} color="secondary">
                <NotificationsIcon className={classes.icon}/>
              </Badge>
            </IconButton>
            <Popover 
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
              <Notifications data={notif}/>
            </Popover>
            <Link to={`/profile/${account}`}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              color="inherit">
              <AccountCircle className={classes.icon}/>
            </IconButton>
            </Link>
          </div>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    </div>
  );
}