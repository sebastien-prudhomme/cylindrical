exports.TestsslArtifactEvents = class TestsslArtifactEvents {
  constructor (app) {
    this.app = app
  }

  async create (data, params) {
    const event = JSON.parse(data.event)
    const eventData = JSON.parse(Buffer.from(event.data, 'base64').toString())

    const id = eventData.notification[0].s3.object.key

    switch (eventData.notification[0].eventName) {
      case 's3:ObjectCreated:Put':
        await this.app.service('testssl-artifacts').create({ id })
        break
      case 's3:ObjectRemoved:Delete':
        await this.app.service('testssl-artifacts').remove(id)
        break
      default:
        break
    }
  }
}
