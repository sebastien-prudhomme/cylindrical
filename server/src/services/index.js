const testsslArtifacts = require('./testssl-artifacts/testssl-artifacts.service.js')
const testsslEvents = require('./testssl-events/testssl-events.service.js')
const testsslJobs = require('./testssl-jobs/testssl-jobs.service.js')

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(testsslArtifacts)
  app.configure(testsslEvents)
  app.configure(testsslJobs)
}
