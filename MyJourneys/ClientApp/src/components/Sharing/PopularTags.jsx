import Chip from "@material-ui/core/Chip";
import React from "react";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {deepPurple} from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  tags: {
    marginTop: '6px',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'baseline'
  },
  avatar: {
    color: `${theme.palette.getContrastText(deepPurple[500])} !important`,
    backgroundColor: deepPurple[500],
  },
  tag: {
    marginBottom: '6px',
    marginRight: '6px'
  }
}));

export default function PopularTags(props) {
  const classes = useStyles();
  const {activeTag, tags, handleClick} = props;

  return (
    <React.Fragment>
      <Typography component='h2' variant='h5'>
        Popular tags
      </Typography>
      <div className={classes.tags}>
        {tags.map(tag =>
          <Chip className={classes.tag} key={tag.tag}
                avatar={<Avatar className={classes.avatar}>{tag.count}</Avatar>}
                label={tag.tag}
                color={activeTag === tag.tag ? 'secondary' : undefined}
                onClick={() => handleClick(tag.tag)}
                variant="outlined"
          />
        )}
      </div>
    </React.Fragment>
  )
}