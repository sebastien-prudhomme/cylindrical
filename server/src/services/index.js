const testsslJobs = require('./testssl-jobs/testssl-jobs.service.js')

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(testsslJobs)
}
