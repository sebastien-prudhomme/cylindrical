// Initializes the `testssl-events` service on path `/testssl-events`
const { TestsslEvents } = require('./testssl-events.class')
const hooks = require('./testssl-events.hooks')

module.exports = function (app) {
  // Initialize our service
  app.use('/testssl-events', new TestsslEvents(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('testssl-events')

  service.hooks(hooks)
}
