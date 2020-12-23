const Joi = require('joi')
const validateJoi = require('feathers-validate-joi')

const joiCreateSchema = Joi.object({
  event: Joi.string().trim().min(1)
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
    create: [validateJoi.form(joiCreateSchema, joiOptions)],
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
