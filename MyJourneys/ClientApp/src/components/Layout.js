import React from 'react';
import NavBar from "./NavBar";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '80px',
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`
    },
    [theme.breakpoints.up(1440)]: {
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
}));

export default function Layout(props) {
  const classes = useStyles();

  return (
    <div>
      <NavBar/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
      <Container maxWidth="md" className={classes.container}>
        {props.children}
      </Container>
    </div>
  );
}
