import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import React, {useContext, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuIcon from '@material-ui/icons/Menu';
import Register from "./Authentication/Register";
import Login from "./Authentication/Login";
import Logout from "./Authentication/Logout";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import MapIcon from '@material-ui/icons/Map';
import WorkIcon from '@material-ui/icons/Work';
import {Link} from "react-router-dom";
import useTheme from "@material-ui/core/styles/useTheme";
import {Context} from "../state/store";
import Button from "@material-ui/core/Button";
import {setDarkMode} from "../state/actions";
import InvertColorsIcon from '@material-ui/icons/InvertColors';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.background.paper,
  },
  menuButton: {
    color: theme.palette.text.primary,
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  rightAlign: {
    marginLeft: 'auto'
  },
  logo: {
    height: '64px'
  }
}));

export default function NavBar() {
  const classes = useStyles();
  const theme = useTheme();

  const [state, dispatch] = useContext(Context);
  const {user, darkMode} = state;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileDrawerClose = () => {
    if (theme.breakpoints.values['md'] >= window.innerWidth) {
      setMobileOpen(false);
    }
  };
  
  const handleThemeChange = () => {
    setDarkMode(dispatch, !darkMode);
  };

  let authControls;
  if (user) {
    authControls = <Logout/>;
  } else {
    authControls = <React.Fragment><Login/><Register/></React.Fragment>
  }

  const drawer = (
    <div>
      <div className={classes.toolbar}/>
      <List>
        <ListItem button component={Link} to="/" onClick={handleMobileDrawerClose}>
          <ListItemIcon><MapIcon/></ListItemIcon>
          <ListItemText primary="Past journeys"/>
        </ListItem>
        <ListItem button component={Link} to="/articles" onClick={handleMobileDrawerClose}>
          <ListItemIcon><SpeakerNotesIcon/></ListItemIcon>
          <ListItemText primary="Articles"/>
        </ListItem>
        <ListItem button component={Link} to="/journeys" onClick={handleMobileDrawerClose}>
          <ListItemIcon><WorkIcon/></ListItemIcon>
          <ListItemText primary="Planner"/>
        </ListItem>
      </List>
      <Divider/>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon/>
          </IconButton>
          <Link to="/">
            <img className={classes.logo} src={"/images/logo.png"} alt="MyJourneys"/>
          </Link>
          <div className={classes.rightAlign}>
            <Button onClick={handleThemeChange}><InvertColorsIcon/></Button>
            {authControls}
          </div>
        </Toolbar>
      </AppBar>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          className={classes.drawer}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
}