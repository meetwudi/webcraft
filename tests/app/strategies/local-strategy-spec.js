var localStrategy = appRequire('app/strategies/local-strategy')
var bcrypt = require('bcrypt-nodejs')

describe('_comparePassword', function () {
  it('should output true when raw password matches encrypted password', function (done) {
    const password = 'abc'
    const encryptedPassword = bcrypt.hashSync('abc')
    localStrategy._comparePassword(password, encryptedPassword, function (err, passwordValid) {
      if (err) done(err)
      passwordValid.should.be.ok
      done()
    })
  })
})
