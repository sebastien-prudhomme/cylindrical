// Initializes the `testssl-job-stats` service on path `/testssl-job-stats`
const { TestsslJobStats } = require('./testssl-job-stats.class')
const hooks = require('./testssl-job-stats.hooks')

module.exports = function (app) {
  // Initialize our service
  app.use('/testssl-job-stats', new TestsslJobStats(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('testssl-job-stats')

  service.hooks(hooks)
}
