import React from 'react';

/*
  Component specific stylesheet
  Can also use .less, .scss, or plain .css files here
*/
require('./style.sass');

/*
  Reference an image and get back a URL automatically via webpack.
  webpack takes care of versioning, bundling for production, etc.
*/
const logoURL = require('./images/react-logo.svg');

export default class Header extends React.Component {
  static displayName = 'Header'
  render() {
    return (
      <header className="HeaderComponent">
        <img className="HeaderComponent-logo" src={logoURL} height="125" />

        <div className="HeaderComponent-wrap">
          <h1 className="HeaderComponent-title">YARSK</h1>
        </div>
      </header>
    );
  }
}
