const errors = require('@feathersjs/errors')
const request = require('request-promise-native')

function buildResult (item) {
  return {
    id: item.metadata.name,
    parameters: item.spec.arguments.parameters,
    phase: item.status === undefined ? undefined : item.status.phase
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

exports.TestsslJobs = class TestsslJobs {
  constructor (app) {
    this.kubeConfig = app.get('kubeConfig')
    this.kubeRequestOpts = app.get('kubeRequestOpts')
  }

  async find (params) {
    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/cylindrical/workflows`,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.get(requestOpts)

      return response.items.map(item => buildResult(item))
    } catch (error) {
      throw buildKubernetesError(error)
    }
  }

  async get (id, params) {
    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/cylindrical/workflows/${id}`,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.get(requestOpts)

      return buildResult(response)
    } catch (error) {
      throw buildKubernetesError(error)
    }
  }

  async create (data, params) {
    const workflow = {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Workflow',
      metadata: {
        generateName: 'testssl-'
      },
      spec: {
        entrypoint: 'testssl',
        arguments: {
          parameters: [
            {
              name: 'target',
              value: data.target
            }
          ]
        },
        workflowTemplateRef: {
          name: 'testssl'
        }
      }
    }

    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/cylindrical/workflows`,
      body: workflow,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.post(requestOpts)

      return buildResult(response)
    } catch (error) {
      throw buildKubernetesError(error)
    }
  }
}
