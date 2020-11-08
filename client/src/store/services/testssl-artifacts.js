import { getApplication, getApplicationVuex } from '../feathers'

export default function () {
  class TestsslArtifact extends getApplicationVuex().BaseModel {
    static modelName = 'TestsslArtifact'
  }

  const servicePath = 'testssl-artifacts'

  const servicePlugin = getApplicationVuex().makeServicePlugin({
    Model: TestsslArtifact,
    service: getApplication().service(servicePath),
    servicePath
  })

  return servicePlugin
}
