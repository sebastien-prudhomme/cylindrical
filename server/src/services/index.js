const testsslArtifacts = require('./testssl-artifacts/testssl-artifacts.service.js')
const testsslArtifactEvents = require('./testssl-artifact-events/testssl-artifact-events.service.js')
const testsslJobs = require('./testssl-jobs/testssl-jobs.service.js')
const testsslJobEvents = require('./testssl-job-events/testssl-job-events.service.js')

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(testsslArtifacts)
  app.configure(testsslArtifactEvents)
  app.configure(testsslJobs)
  app.configure(testsslJobEvents)
}
