const minio = require('minio')

module.exports = function (app) {
  const { endPoint, port, useSSL, accessKey, secretKey } = app.get('minio')
  const minioClient = new minio.Client({ endPoint, port, useSSL, accessKey, secretKey })

  app.set('minioClient', minioClient)
}
