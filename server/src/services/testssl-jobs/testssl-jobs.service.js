// Initializes the `testssl-jobs` service on path `/testssl-jobs`
const { TestsslJobs } = require('./testssl-jobs.class')
const hooks = require('./testssl-jobs.hooks')

module.exports = function (app) {
  // Initialize our service
  app.use('/testssl-jobs', new TestsslJobs(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('testssl-jobs')

  service.hooks(hooks)
}
