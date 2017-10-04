'use strict'

const chai = require('chai')
const expect = chai.expect

describe('Test Hello world Integration', function () {
  it('should to be a string', function () {
      expect('Hello world integration').to.be.a('string')
  })
})
