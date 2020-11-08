const getStream = require('get-stream')
const errors = require('@feathersjs/errors')

exports.TestsslArtifacts = class TestsslArtifacts {
  constructor (app) {
    this.minioClient = app.get('minioClient')
  }

  async find (params) {
    const jobIds = params.query.jobId.$in

    try {
      const streams = await Promise.all(jobIds.map(jobId => this.minioClient.listObjects('cylindrical', `${jobId}/`)))
      const objects = await Promise.all(streams.map(stream => getStream.array(stream)))

      return Promise.all(objects.flat().map(object => this.get(object.name)))
    } catch (error) {
      throw new errors.GeneralError(error.message)
    }
  }

  async get (id, params) {
    try {
      const jobId = id.split('/')[0]

      const stream = await this.minioClient.getObject('cylindrical', id)
      const content = await getStream(stream)

      return { id, jobId, content }
    } catch (error) {
      throw new errors.GeneralError(error.message)
    }
  }
}
