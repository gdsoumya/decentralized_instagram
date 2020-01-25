import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: "30rem",
    minWidth: "33vw",
    margin: "2rem auto"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  text:{
      color:"black",
      fontWeight:"bold",
  },
  caption:{
    color:"black",
    margin: "0.3rem 0rem 1rem 1rem"
  },
  likes:{
    fontWeight:"bold",
    margin:"-0.5rem 0rem 0rem 1rem",
    color:"black"
  },
  link:{
    textDecoration:"none"
  }
}));

const FeedPost=(props) =>{
  const classes = useStyles();
  const {contract,account}=props;
  const { name, img, id, content, acc} = props.data;
  const [color, setColor] = React.useState("grey");
  const [likes, setLikes] = React.useState(0);
  
  useEffect(() => {
      contract.methods.getPost(acc,id).call().then(res=>{
        let count = res[2].length;
        if(count===1)
          setLikes("1 Like");
        else
          setLikes(`${count} Likes`)
        if(res[2].includes(account))
          setColor("red");
      })
  },[])

  const like=async ()=>{
      if(color==="red"){
        await contract.methods.toggleLike(acc,id).send({from:account})
        setColor("grey")
      }
      else{
        await contract.methods.toggleLike(acc,id).send({from:account})
        setColor("red")
      }
      contract.methods.getPost(acc,id).call().then(res=>{
        let count = res[2].length;
        if(count===1)
          setLikes("1 Like");
        else
          setLikes(`${count} Likes`)
      })
  }
  return (
    <Card className={classes.card}>
      <CardHeader className={classes.text}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} src="https://cdn.dribbble.com/users/1041205/screenshots/3636353/dribbble.jpg" alt="name"/>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={<Link className={classes.link} to={`/profile/${acc}`}><span className={classes.text}>{name}</span></Link>}
        // subheader={date}
      />
      <CardMedia
        className={classes.media}
        image={`https://ipfs.infura.io/ipfs/${img}`}
        title={content}
      />
      {/* <CardContent>
      </CardContent> */}
      <CardActions disableSpacing>
        <IconButton style={{color:color}} onClick={like} aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <Typography className={classes.likes} variant="body2" color="textSecondary" component="p">
          {likes}
      </Typography>
      <Typography className={classes.caption} variant="body2" color="textSecondary" component="p">
      <Link className={classes.link} to={`/profile/${acc}`}><strong>{name}</strong></Link> {content}
        </Typography>
    </Card>
  );
}

export default FeedPost;