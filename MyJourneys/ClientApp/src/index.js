import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Store from "./state/store";

require('dotenv').config();

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

Sentry.init({dsn: process.env.REACT_APP_SENTRY_DSN});

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <Store>
      <App/>
    </Store>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();
