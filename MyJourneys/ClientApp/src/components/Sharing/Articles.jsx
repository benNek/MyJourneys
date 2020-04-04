import React, {useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import {getBlogs} from "../../utils/networkFunctions";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {readingTime} from "../../utils/readingTime";
import removeMd from "remove-markdown";
import TextTruncate from "react-text-truncate";
import {setBlogs} from "../../state/actions";
import {Context} from "../../state/store";
import ArticlesSpeedDial from "./ArticlesSpeedDial";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
  card: {
    marginBottom: '12px'
  },
  blogInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    fontWeight: 300,
    marginBottom: '8px',
    opacity: .6
  },
  heading: {
    marginBottom: '12px'
  },
  readMore: {
    display: 'inline-block',
    marginTop: '12px'
  }
});

export default function Articles() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const {blogs} = state;

  useEffect(() => {
    if(!blogs.length) {
      getBlogs().then(res => setBlogs(dispatch, res.data)).catch(err => console.log(err));
    }
  }, [dispatch]);

  const renderBlogs = () => {
    if (!blogs.length) {
      return;
    }

    return blogs.map(blog =>
      <Card className={classes.card} key={blog.id} variant="outlined">
        <CardContent>
          <Typography className={classes.blogInfo} variant="subtitle1">
            <span>Written by {blog.authorName}</span>
            <span>{readingTime(blog.text).text}</span>
          </Typography>
          <Typography className={classes.heading} variant="h5" component="h2">
            {blog.title}
          </Typography>
          <Typography variant="body2">
            <TextTruncate
              line={2}
              element="span"
              truncateText="…"
              text={removeMd(blog.text).replace('\\', '')}
            />
          </Typography>
          <Link className={classes.readMore} to={`/articles/${blog.id}`}>Continue reading</Link>
        </CardContent>
      </Card>
    );
  };

  return (
    <React.Fragment>
      <Typography component='h1' variant='h3'>
        Articles
      </Typography>
      <Divider/>
      {renderBlogs()}
      <ArticlesSpeedDial/>
    </React.Fragment>
  )
}
