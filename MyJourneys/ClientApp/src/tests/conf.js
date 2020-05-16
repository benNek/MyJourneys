let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  jasmineNodeOpts: {
    print: function () {
    }
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: 'pretty'
      }
    }));
  },
  specs: ['articles.js', 'planner.js', 'overview.js']
};