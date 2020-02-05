import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuIcon from '@material-ui/icons/Menu';
import {grey} from "@material-ui/core/colors";
import Register from "./Authentication/Register";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menu: {
    backgroundColor: '#fff',
    color: grey[900],
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 400
  }
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.menu}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            MyJourneys
          </Typography>
          <Register/>
        </Toolbar>
      </AppBar>
    </div>
  );
}