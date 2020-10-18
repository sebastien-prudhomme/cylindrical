const Joi = require('@hapi/joi')
const validateJoi = require('@feathers-plus/validate-joi')

const joiSchema = Joi.object({
  target: Joi.string().domain()
})

const joiOptions = {
  abortEarly: false,
  allowUnknown: false,
  convert: true,
  presence: 'required'
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateJoi.form(joiSchema, joiOptions)],
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
