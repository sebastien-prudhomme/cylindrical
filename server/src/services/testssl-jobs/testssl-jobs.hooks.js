const { disallow } = require('feathers-hooks-common')
const Joi = require('@hapi/joi')
const validateJoi = require('@feathers-plus/validate-joi')
const { paramsFromClient, populate } = require('feathers-graph-populate')

const joiCreateSchema = Joi.object({
  parameters: Joi.array().items(Joi.object({
    name: 'target',
    value: Joi.string().domain()
  }))
})

const joiUpdateSchema = Joi.object({
  id: Joi.string().trim().min(1),
  parameters: Joi.array().items(Joi.object({
    name: 'target',
    value: Joi.string().domain()
  })),
  phase: Joi.string().valid('Error', 'Failed', 'Omitted', 'Pending', 'Running', 'Skipped', 'Succeeded')
})

const joiOptions = {
  abortEarly: false,
  allowUnknown: false,
  convert: true,
  presence: 'required'
}

const populates = {
  artifacts: {
    service: 'testssl-artifacts',
    nameAs: 'artifacts',
    keyHere: 'id',
    keyThere: 'jobId'
  }
}

const namedQueries = {
  withArtifacts: {
    artifacts: {}
  }
}

module.exports = {
  before: {
    all: [paramsFromClient('$populateParams')],
    find: [],
    get: [],
    create: [validateJoi.form(joiCreateSchema, joiOptions)],
    update: [
      disallow('external'),
      validateJoi.form(joiUpdateSchema, joiOptions)
    ],
    patch: [],
    remove: [disallow('external')]
  },

  after: {
    all: [populate({ populates, namedQueries })],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
