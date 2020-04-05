import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useParams} from "react-router";
import {getArticle} from "../../utils/networkFunctions";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Editor from "rich-markdown-editor";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton
} from "react-share";

const useStyles = makeStyles({
  divider: {
    margin: '12px 0'
  },
  dateSocialBlock: {
    display: 'flex',
    justifyContent: 'space-between'
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

  let {id} = useParams();

  useEffect(() => {
    getArticle(id).then(res => setArticle(res.data)).catch(err => console.log(err));
  }, []);

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
        <Typography className={classes.dateSocialBlock} variant="caption">
          {moment(article.createDate, 'YYYY-MM-DD').fromNow()}
          <span className={classes.social}>
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
