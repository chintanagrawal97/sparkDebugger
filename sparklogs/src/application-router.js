import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import Page2 from './page-2/SparkPage2';
import HivePage2 from './page-2/HivePage2'
import HbasePage2 from './page-2/HbasePage2';



const history = createBrowserHistory();

function ApplicationRouter() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/SparkPage2" exact component={Page2} />
        <Route path="/HbasePage2" exact component={HbasePage2} />
        <Route path="/HivePage2" exact component={HivePage2} />
      </Switch>
    </Router>
  );
}

export default ApplicationRouter;

