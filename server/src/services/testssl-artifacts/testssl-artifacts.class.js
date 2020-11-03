const getStream = require('get-stream')
const errors = require('@feathersjs/errors')

exports.TestsslArtifacts = class TestsslArtifacts {
  constructor (app) {
    this.minioClient = app.get('minioClient')
  }

  async get (id, params) {
    try {
      const jsonStream = await this.minioClient.getObject('cylindrical', `${id}/output.json`)
      const json = await getStream(jsonStream)

      const logStream = await this.minioClient.getObject('cylindrical', `${id}/output.log`)
      const log = await getStream(logStream)

      return { id, json, log }
    } catch (error) {
      throw new errors.GeneralError(error.message)
    }
  }
}
