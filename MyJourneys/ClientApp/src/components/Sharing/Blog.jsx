import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useParams} from "react-router";
import {getBlog} from "../../utils/networkFunctions";
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

export default function Blog() {
  const classes = useStyles();
  const [blog, setBlog] = useState(undefined);

  let {id} = useParams();

  useEffect(() => {
    getBlog(id).then(res => setBlog(res.data)).catch(err => console.log(err));
  }, []);

  if (!blog) {
    return (
      <React.Fragment/>
    )
  }
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography className={classes.heading} variant="h3" component="h1">
          {blog.title}
        </Typography>
        <Divider className={classes.divider}/>
        <Editor
          readOnly={true}
          defaultValue={blog.text}
        />
        <Divider className={classes.divider}/>
        <Typography className={classes.dateSocialBlock} variant="caption">
          {moment(blog.createDate, 'YYYY-MM-DD').fromNow()}
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
