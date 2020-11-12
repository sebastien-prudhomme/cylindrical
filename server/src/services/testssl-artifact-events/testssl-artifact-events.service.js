// Initializes the `testssl-artifact-events` service on path `/testssl-artifact-events`
const { TestsslArtifactEvents } = require('./testssl-artifact-events.class')
const hooks = require('./testssl-artifact-events.hooks')

module.exports = function (app) {
  // Initialize our service
  app.use('/testssl-artifact-events', new TestsslArtifactEvents(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('testssl-artifact-events')

  service.hooks(hooks)
}
