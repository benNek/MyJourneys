import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {readingTime} from "../../utils/readingTime";
import TextTruncate from "react-text-truncate";
import removeMd from "remove-markdown";
import {Link} from "react-router-dom";
import Card from "@material-ui/core/Card";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: '12px'
  },
  articleInfo: {
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
  },
  tags: {
    marginTop: '-8px',
    marginBottom: '12px'
  },
  tag: {
    marginRight: '6px'
  }
}));

export default function ArticlePreview(props) {
  const classes = useStyles();
  const {article, activeTag, handleTagClick} = props;

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
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Typography className={classes.articleInfo} variant="subtitle1">
          <span>Written by {article.authorName}</span>
          <span>{readingTime(article.text).text}</span>
        </Typography>
        <Typography className={classes.heading} variant="h5" component="h2">
          {article.title}
        </Typography>
        {renderTags(article.tags)}
        <Typography variant="body2">
          <TextTruncate
            line={2}
            element="span"
            truncateText="…"
            text={removeMd(article.text).replace('\\', '')}
          />
        </Typography>
        <Link className={classes.readMore} to={`/articles/${article.id}`}>Continue reading</Link>
      </CardContent>
    </Card>
  )
  
}