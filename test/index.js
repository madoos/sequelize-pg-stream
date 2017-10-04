'use strict'

const chai = require('chai')
const expect = chai.expect

describe('Test Hello world', function () {
  it('should to be a string', function () {
      expect('Hello world').to.be.a('string')
  })
})
