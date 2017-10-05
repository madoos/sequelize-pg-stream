'use strict'

const mix = Object.assign
const streamMethods = require('./streamMethods')

const Associator = require('./transforms/Associator')

module.exports = {
  streamFromModel,
  streamFromInstance,
  streamFromConstructor,
  include: (...args) => new Associator(...args)
}

function streamFromModel (Model) {
  return mix(Model, streamMethods)
}

function streamFromInstance (sequelize) {
  const __originalDefine = sequelize.define

  sequelize.define = function (...args) {
    const Model = __originalDefine.apply(sequelize, args)
    return streamFromModel(Model)
  }

  return sequelize
}

function streamFromConstructor (Sequelize) {
  return function SequelizeWithStream (...args) {
    return streamFromInstance(new Sequelize(...args))
  }
}

