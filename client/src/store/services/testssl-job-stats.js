import { getApplication, getApplicationVuex } from '../feathers'

export default function () {
  class TestsslJobStat extends getApplicationVuex().BaseModel {
    static modelName = 'TestsslJobStat'
  }

  const servicePath = 'testssl-job-stats'

  const servicePlugin = getApplicationVuex().makeServicePlugin({
    Model: TestsslJobStat,
    service: getApplication().service(servicePath),
    servicePath
  })

  return servicePlugin
}
