var webpackConfig = require('./webpack.config.js');

module.exports = function (options) {
  var karmaConfig = {
    frameworks: ['mocha', 'chai'],

    browsers: ['PhantomJS'],

    files: [
      // This shim adds .bind to PhantomJS
      './phantomjs-shim.js',
      '../src/**/*.spec.js',
    ],

    preprocessors: {
      '../src/**/*.spec.js': ['webpack'],
    },

    webpackMiddleware: {
        noInfo: true,
        quiet: true
    },

    reporters: ['mocha'],

    plugins: [
      'karma-webpack',
      'karma-babel-preprocessor',
      'karma-mocha',
      'karma-chai',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
    ],

    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd'
      }
    }
  };

  if (options.coverage) {
    // Needs to load first to prevent linting issues
    webpackConfig.module.preLoaders = [
      {
        test: /\.jsx?$/,
        exclude: /(__tests__|node_modules)/,
        loader: 'isparta-instrumenter-loader',
      },
    ].concat(webpackConfig.module.preLoaders);

    karmaConfig.plugins.push('karma-coverage');

    karmaConfig.coverageReporter = {
      dir: '../coverage',
      reporters: options.coverageReporters || [
        { type: 'text' },
        { type: 'html' },
      ],
    };

    karmaConfig.reporters.push('coverage');
  }

  if (options.notify) {
    karmaConfig.reporters.push('notify');
    karmaConfig.plugins.push('karma-notify-reporter');
  }

  karmaConfig.webpack = webpackConfig;

  return karmaConfig;
};
