import React, {useContext, useEffect} from "react";
import {getArticles, getPopularTags} from "../../utils/networkFunctions";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {loadArticles, setActiveTag, setArticles, setPopularTags, setSortType} from "../../state/actions";
import {Context} from "../../state/store";
import Divider from "@material-ui/core/Divider";
import PopularTags from "./PopularTags";
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import SubjectIcon from '@material-ui/icons/Subject';
import {useHistory} from "react-router";
import ArticlePreview from "./ArticlePreview";
import Filters from "./Filters";

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
  sorts: {
    marginBottom: '12px'
  },
  articles: {
    flexBasis: '70%'
  },
  rightSection: {
    flexBasis: '30%',
    marginBottom: '6px',
    [theme.breakpoints.up('md')]: {
      marginBottom: 0,
      marginLeft: '18px',
    },
  },
  clearAllBtn: {
    marginTop: '12px',
    display: 'block'
  }
}));

export default function Articles() {
  const classes = useStyles();
  const history = useHistory();
  const [state, dispatch] = useContext(Context);
  const {activeTag, sortType, popularTags, articles} = state;

  useEffect(() => {
    if (!articles.length) {
      getArticles({
        tag: activeTag,
        sortType
      }).then(res => setArticles(dispatch, res.data)).catch(err => toast.error(err));
    }

    if (!popularTags.length) {
      getPopularTags().then(res => setPopularTags(dispatch, res.data)).catch(err => toast.error(err));
    }
  }, [dispatch]);

  const handleTagClick = tag => {
    skip = 0;
    if (activeTag === tag) {
      tag = '';
    }
    setActiveTag(dispatch, tag);
    getArticles({tag, sortType}).then(res => setArticles(dispatch, res.data)).catch(err => toast.error(err));
  };

  const handleLoadMoreClick = () => {
    skip += take;
    getArticles({
      tag: activeTag, skip, take
    }).then(res => loadArticles(dispatch, res.data)).catch(err => toast.error(err));
  };

  const handleSortTypeClick = (type) => {
    setSortType(dispatch, type);
    getArticles({tag: activeTag, sortType: type})
      .then(res => setArticles(dispatch, res.data)).catch(err => toast.error(err));
  };

  const renderArticles = () => {
    if (!articles.length) {
      return (
        <Typography variant='body1'>
          No articles found with selected filters.
          <Button className={classes.clearAllBtn} variant="outlined" onClick={() => handleSortTypeClick('feed')} color="primary">
            Clear filters
          </Button>
        </Typography>
      )
    }

    return articles.map(article =>
      <ArticlePreview key={article.id} article={article} activeTag={activeTag} handleTagClick={handleTagClick}/>
    );
  };

  return (
    <React.Fragment>
      <Typography component='h1' variant='h3'>
        Articles
      </Typography>
      <Divider/>
      {
        articles.length > 0 || sortType !== 'feed' ?
          (
            <div className={classes.container}>
              <div className={classes.articles}>
                <Filters activeFilter={sortType} handleClick={handleSortTypeClick}/>
                {renderArticles()}
                {articles.length > 0 && articles.length === take + skip &&
                <Button onClick={handleLoadMoreClick} fullWidth variant="outlined" color="primary">Load more</Button>}
              </div>
              <div className={classes.rightSection}>
                <PopularTags activeTag={activeTag} tags={popularTags} handleClick={handleTagClick}/>
              </div>
            </div>
          )
          :
          (
            <Typography variant='body1'>
              No articles have been added yet.
            </Typography>
          )
      }
      <Fab onClick={() => history.push('/article')}
           aria-label="add article"
           color="primary"
           className="FloatingActionButton">
        <SubjectIcon/>
      </Fab>
    </React.Fragment>
  )
}
