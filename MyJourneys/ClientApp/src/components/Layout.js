import React, { Component } from 'react';
import NavBar from "./NavBar";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Container from "@material-ui/core/Container";

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavBar />
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
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
