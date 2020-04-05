import React, {useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import {getBlogs, getPopularTags} from "../../utils/networkFunctions";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {readingTime} from "../../utils/readingTime";
import removeMd from "remove-markdown";
import TextTruncate from "react-text-truncate";
import {loadBlogs, setActiveTag, setBlogs, setPopularTags} from "../../state/actions";
import {Context} from "../../state/store";
import ArticlesSpeedDial from "./ArticlesSpeedDial";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import PopularTags from "./PopularTags";
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";

const take = 6;
let skip = 0;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column-reverse',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
    },
  },
  blogs: {
    flexBasis: '70%'
  },
  popularTags: {
    flexBasis: '30%',
    marginBottom: '6px',
    [theme.breakpoints.up('md')]: {
      marginBottom: 0,
      marginLeft: '18px',
    },
  },
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
  tags: {
    marginTop: '-8px',
    marginBottom: '12px'
  },
  tag: {
    marginRight: '6px'
  },
  readMore: {
    display: 'inline-block',
    marginTop: '12px'
  }
}));

export default function Articles() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const {activeTag, popularTags, blogs} = state;

  useEffect(() => {
    if (!blogs.length) {
      getBlogs({tag: activeTag}).then(res => setBlogs(dispatch, res.data)).catch(err => toast.error(err));
    }

    if (!popularTags.length) {
      getPopularTags().then(res => setPopularTags(dispatch, res.data)).catch(err => toast.error(err));
    }
  }, [dispatch]);

  const handleTagClick = tag => {
    skip = 0;
    if (activeTag === tag) {
      setActiveTag(dispatch, '');
      getBlogs().then(res => setBlogs(dispatch, res.data)).catch(err => toast.error(err));
      return;
    }
    setActiveTag(dispatch, tag);
    getBlogs({tag}).then(res => setBlogs(dispatch, res.data)).catch(err => toast.error(err));
  };

  const handleLoadMoreClick = () => {
    skip += take;
    getBlogs({tag: activeTag, skip, take}).then(res => loadBlogs(dispatch, res.data)).catch(err => toast.error(err));
  };

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
          {renderTags(blog.tags)}
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

  const renderTags = tags => {
    if (!tags.length) {
      return;
    }
    return (
      <div className={classes.tags}>
        {tags.map(tag =>
          <Chip
            key={tag}
            className={classes.tag}
            variant="outlined"
            color={activeTag === tag ? 'primary' : undefined}
            size="small"
            label={tag}
            onClick={() => handleTagClick(tag)}
          />
        )}
      </div>
    )
  };

  return (
    <React.Fragment>
      <Typography component='h1' variant='h3'>
        Articles
      </Typography>
      <Divider/>
      <div className={classes.container}>
        <div className={classes.blogs}>
          {renderBlogs()}
          {blogs.length > 0 && skip < blogs.length &&
          <Button onClick={handleLoadMoreClick} fullWidth variant="outlined" color="primary">Load more</Button>}
        </div>
        <div className={classes.popularTags}>
          <PopularTags activeTag={activeTag} tags={popularTags} handleClick={handleTagClick}/>
        </div>
      </div>
      <ArticlesSpeedDial/>
    </React.Fragment>
  )
}
