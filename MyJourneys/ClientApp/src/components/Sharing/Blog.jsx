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

const useStyles = makeStyles({
  divider: {
    margin: '12px 0'
  }
});

export default function Blog() {
  const classes = useStyles();
  const [blog, setBlog] = useState(undefined);

  let { id } = useParams();

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
        <Typography className={classes.heading} variant="h5" component="h2">
          {blog.title}
        </Typography>
        <Divider className={classes.divider} />
        <Editor
          readOnly={true}
          defaultValue={blog.text}
        />
        <Divider className={classes.divider} />
          {moment(blog.createDate, 'YYYY-MM-DD').fromNow()}
      </CardContent>
    </Card>
  )
}
