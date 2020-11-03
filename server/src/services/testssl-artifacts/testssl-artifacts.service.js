// Initializes the `testssl-artifacts` service on path `/testssl-artifacts`
const { TestsslArtifacts } = require('./testssl-artifacts.class')
const hooks = require('./testssl-artifacts.hooks')

module.exports = function (app) {
  // Initialize our service
  app.use('/testssl-artifacts', new TestsslArtifacts(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('testssl-artifacts')

  service.hooks(hooks)
}
