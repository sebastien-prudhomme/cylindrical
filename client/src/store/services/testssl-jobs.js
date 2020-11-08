import { getApplication, getApplicationVuex } from '../feathers'
const { paramsForServer } = require('feathers-graph-populate')

export default function () {
  class TestsslJob extends getApplicationVuex().BaseModel {
    static modelName = 'TestsslJob'

    static setupInstance (data, { models }) {
      if (data.artifacts) {
        data.artifacts = data.artifacts.map(artifact => new models.api.TestsslArtifact(artifact))
      }

      return data
    }
  }

  const servicePath = 'testssl-jobs'

  const servicePlugin = getApplicationVuex().makeServicePlugin({
    Model: TestsslJob,
    service: getApplication().service(servicePath),
    servicePath
  })

  getApplication().service(servicePath).hooks({
    before: {
      all: [paramsForServer('$populateParams')]
    }
  })

  return servicePlugin
}
