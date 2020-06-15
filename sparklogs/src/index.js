import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ApplicationRouter from './application-router.js';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <ApplicationRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
