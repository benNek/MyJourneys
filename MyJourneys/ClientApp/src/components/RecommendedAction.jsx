import Paper from "@material-ui/core/Paper";
import React from "react";
import {useHistory} from "react-router";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer'
  },
  icon: {
    height: '64px',
    width: '64px',
    margin: '24px 0'
  },
  text: {
    marginBottom: '12px'
  }
}));

export default function RecommendedActions(props) {
  const classes = useStyles();
  const history = useHistory();

  const {Icon, text, link} = props;

  const handleClick = () => {
    history.push(link);
  };
  
  return (
    <Paper className={classes.root} onClick={handleClick} elevation={3}>
      <Icon className={classes.icon}/>
      <Typography className={classes.text} variant="subtitle1">
        {text}
      </Typography>
    </Paper>
  )

}