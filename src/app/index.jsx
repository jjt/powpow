require('./css/base.sass');

import React from 'react';
import Router, {Route} from 'react-router';
import Application from './components/Application';

console.log(Router);

const routes = (
  <Route handler={Application} path="/" />
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
