import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import React, {useContext} from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuIcon from '@material-ui/icons/Menu';
import {grey} from "@material-ui/core/colors";
import Register from "./Authentication/Register";
import Login from "./Authentication/Login";
import {UserContext} from "../contexts/userContext";
import Logout from "./Authentication/Logout";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

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
  const {user} = useContext(UserContext);
  const classes = useStyles();

  let authControls;
  if (user) {
    authControls = <Logout/>;
  } else {
    authControls = <React.Fragment><Login/><Register/></React.Fragment>
  }

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
          <Button color="inherit"><Link to="/planner">Trip Planner</Link></Button>
          {authControls}
        </Toolbar>
      </AppBar>
    </div>
  );
}