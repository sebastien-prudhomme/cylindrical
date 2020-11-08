const { disallow } = require('feathers-hooks-common')
const Joi = require('@hapi/joi')
const validateJoi = require('@feathers-plus/validate-joi')

const joiFindSchema = Joi.object({
  jobId: Joi.object({
    $in: Joi.array().items(Joi.string().trim().min(1))
  })
})

const joiOptions = {
  abortEarly: false,
  allowUnknown: false,
  convert: true,
  presence: 'required'
}

const joiFindOptions = {
  ...joiOptions,
  getContext(context) {
    return context.params.query
  },
  setContext(context, values) {
    Object.assign(context.params.query, values)
  }
}

module.exports = {
  before: {
    all: [disallow('external')],
    find: [validateJoi.form(joiFindSchema, joiFindOptions)],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
