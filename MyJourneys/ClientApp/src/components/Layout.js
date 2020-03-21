import React from 'react';
import NavBar from "./NavBar";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  container: {
    marginTop: '80px'
  }
});

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
      <Container className={classes.container}>
        {props.children}
      </Container>
    </div>
  );
}
