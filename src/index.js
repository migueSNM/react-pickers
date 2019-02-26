import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from "react-apollo";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ROUTE_API } from "./config/paths";
import Auth from './utils/auth';

const client = new ApolloClient({
  uri: ROUTE_API,
  headers: { Authorization: `Bearer ${Auth.getAccessToken()}` },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  , document.getElementById('root'));

serviceWorker.unregister();
