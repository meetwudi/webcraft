var Doc = appRequire('app/models/Doc')
var should = require('should')

describe('Doc Model', function () {
  it('should load correctly', function () {
    should.exist(Doc)
  })
})
