'use strict'

const Associator = require('./Associator')

class Builder extends Associator {
  constructor (opt, model) {
    super(opt)
    this.model = model
  }

  _transform (data, enc, done) {
    done(null, this.model.build(data))
  }

}

module.exports = Builder
