const testsslEvents = require('./testssl-events/testssl-events.service.js')
const testsslJobs = require('./testssl-jobs/testssl-jobs.service.js')

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(testsslEvents)
  app.configure(testsslJobs)
}
