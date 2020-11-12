// Initializes the `testssl-job-events` service on path `/testssl-job-events`
const { TestsslJobEvents } = require('./testssl-job-events.class')
const hooks = require('./testssl-job-events.hooks')

module.exports = function (app) {
  // Initialize our service
  app.use('/testssl-job-events', new TestsslJobEvents(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('testssl-job-events')

  service.hooks(hooks)
}
