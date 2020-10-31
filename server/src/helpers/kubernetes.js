const errors = require('@feathersjs/errors')

function buildKubernetesId (item) {
  return item.metadata.name
}

function buildKubernetesData (item) {
  return {
    id: buildKubernetesId(item),
    parameters: item.spec.arguments.parameters,
    phase: item.status === undefined ? null : item.status.phase
  }
}

function buildError (code, message) {
  switch (code) {
    case 400:
      return new errors.BadRequest(message)
    case 401:
      return new errors.NotAuthenticated(message)
    case 402:
      return new errors.PaymentError(message)
    case 403:
      return new errors.Forbidden(message)
    case 404:
      return new errors.NotFound(message)
    case 405:
      return new errors.MethodNotAllowed(message)
    case 406:
      return new errors.NotAcceptable(message)
    case 408:
      return new errors.Timeout(message)
    case 409:
      return new errors.Conflict(message)
    case 410:
      return new errors.Gone(message)
    case 411:
      return new errors.LengthRequired(message)
    case 422:
      return new errors.Unprocessable(message)
    case 429:
      return new errors.TooManyRequests(message)
    case 500:
      return new errors.GeneralError(message)
    case 501:
      return new errors.NotImplemented(message)
    case 502:
      return new errors.BadGateway(message)
    case 503:
      return new errors.Unavailable(message)
    default:
      return new errors.GeneralError(message)
  }
}

function buildKubernetesError (error) {
  return buildError(error.error.code, error.error.message)
}

module.exports.buildKubernetesId = buildKubernetesId
module.exports.buildKubernetesData = buildKubernetesData
module.exports.buildKubernetesError = buildKubernetesError
