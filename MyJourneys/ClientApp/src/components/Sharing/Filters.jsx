import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";

const sortTypes = [
  {
    short: 'F',
    name: 'Feed',
    code: 'feed',
    color: 'primary'
  },
  {
    short: 'W',
    name: 'Weekly best',
    code: 'weekly',
    color: 'secondary'
  },
  {
    short: 'M',
    name: 'Monthly best',
    code: 'monthly',
    color: 'primary'
  },
  {
    short: 'A',
    name: 'All-time best',
    code: 'all_time',
    color: 'secondary'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '12px'
  },
  type: {
    marginRight: '6px'
  }
}));

export default function Filters(props) {
  const classes = useStyles();
  const {activeFilter, handleClick} = props;

  return (
    <div className={classes.root}>
      {sortTypes.map(type => (
        <Chip
          key={type.code}
          className={`${classes.type} articles__filter`}
          avatar={<Avatar>{type.short}</Avatar>}
          label={type.name}
          color={activeFilter === type.code ? 'secondary' : undefined}
          onClick={() => handleClick(type.code)}
        />
      ))}
    </div>
  )
}