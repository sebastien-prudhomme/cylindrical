import { getApplication, getApplicationVuex } from '../feathers'
import { handleServerPopulatedReferences } from '../handle-server-populated-references'
import { paramsForServer } from 'feathers-graph-populate'

export default function () {
  class TestsslJob extends getApplicationVuex().BaseModel {
    static modelName = 'TestsslJob'

    static setupInstance (data, { models }) {
      const populate = {
        model: models.api.TestsslArtifact,
        keyHere: 'id',
        keyThere: 'jobId',
        asArray: true
      }

      handleServerPopulatedReferences(data, 'artifacts', populate)

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
