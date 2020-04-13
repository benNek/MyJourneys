import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useParams} from "react-router";
import {getArticle, hasLikedArticle, likeArticle} from "../../utils/networkFunctions";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Editor from "rich-markdown-editor";
import Divider from "@material-ui/core/Divider";
import moment, {utc} from "moment";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton
} from "react-share";
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';

import './Article.css';

const useStyles = makeStyles({
  divider: {
    margin: '12px 0'
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  likesCount: {
    display: 'inline-block',
    marginLeft: '6px',
    verticalAlign: 'middle'
  },
  date: {
    display: 'block',
    marginBottom: '6px',
    textAlign: 'right'
  },
  social: {
    display: 'inline-block',
    marginLeft: '-8px'
  },
  socialItem: {
    marginLeft: '8px'
  }
});

export default function Article() {
  const classes = useStyles();
  const [article, setArticle] = useState(undefined);
  const [hasLiked, setHasLiked] = useState(false);

  let {id} = useParams();

  useEffect(() => {
    getArticle(id).then(res => setArticle(res.data)).catch(err => console.error(err));
    hasLikedArticle(id).then(res => setHasLiked(res.data)).catch(err => console.error(err));
  }, []);

  const handleLikeClick = () => {
    likeArticle(id).then(res => res);
  };

  const getLikesCountMessage = (likesCount) => {
    if (likesCount === 0) {
      return "Be the first one to like this article.";
    } else if (likesCount === 1) {
      return "1 like";
    } else {
      return `${likesCount} likes`;
    }
  };
  
  if (!article) {
    return (
      <React.Fragment/>
    )
  }
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography className={classes.heading} variant="h3" component="h1">
          {article.title}
        </Typography>
        <Divider className={classes.divider}/>
        <Editor
          readOnly={true}
          defaultValue={article.text}
        />
        <Divider className={classes.divider}/>
        <Typography className={classes.bottom} variant="caption">
          <div>
            <FavoriteTwoToneIcon
              onClick={handleLikeClick}
              className={`Article__heartIcon${hasLiked ? '--active' : ''}`}
            />
            <Typography variant="caption" className={classes.likesCount}>
              {getLikesCountMessage(article.likesCount)}
            </Typography>
          </div>
          <span className={classes.social}>
            <Typography variant="caption" className={classes.date}>
              {utc(article.createDate).fromNow()}
            </Typography>
            <EmailShareButton className={classes.socialItem} url={window.location.href}>
              <EmailIcon size={24} round={true} bgStyle={{fill: '#484848'}}/>
            </EmailShareButton>
            <TwitterShareButton className={classes.socialItem} url={window.location.href}>
              <TwitterIcon size={24} round={true} bgStyle={{fill: '#484848'}}/>
            </TwitterShareButton>
            <FacebookShareButton className={classes.socialItem} url={window.location.href}>
              <FacebookIcon size={24} round={true} bgStyle={{fill: '#484848'}}/>
            </FacebookShareButton>
          </span>
        </Typography>
      </CardContent>
    </Card>
  )
}
