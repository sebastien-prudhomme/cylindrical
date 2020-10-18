import { getApplication, getApplicationVuex } from '../feathers'

export default function () {
  class TestsslJob extends getApplicationVuex().BaseModel {
    static modelName = 'TestsslJob'
  }

  const servicePath = 'testssl-jobs'

  const servicePlugin = getApplicationVuex().makeServicePlugin({
    Model: TestsslJob,
    service: getApplication().service(servicePath),
    servicePath
  })

  return servicePlugin
}
