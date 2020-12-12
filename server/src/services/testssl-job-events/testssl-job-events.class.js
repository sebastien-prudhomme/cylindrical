const { buildKubernetesId } = require('../../helpers/kubernetes')

exports.TestsslJobEvents = class TestsslJobEvents {
  constructor (app) {
    this.app = app
  }

  async create (data, params) {
    const event = JSON.parse(data.event)
    const eventData = JSON.parse(Buffer.from(event.data, 'base64').toString())

    const id = buildKubernetesId(eventData.body)

    switch (eventData.type) {
      case 'ADD':
        await this.app.service('testssl-job-stats').update('running', {})
        break
      case 'UPDATE':
        await this.app.service('testssl-jobs').update(id, {})
        await this.app.service('testssl-job-stats').update('running', {})
        break
      case 'DELETE':
        await this.app.service('testssl-jobs').remove(id)
        await this.app.service('testssl-job-stats').update('running', {})
        break
      default:
        break
    }
  }
}
