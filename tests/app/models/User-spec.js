var User = appRequire('app/models/User')
var dbTracker = require('mock-knex').getTracker()
var bcrypt = require('bcrypt-nodejs')
var should = require('should')

describe('User', function () {
  describe('getUserByUsername', function () {
    it('should resolves a correct user if the username matches any user', function (done) {
      dbTracker.install()
      var username = 'abc'

      User.getUserByUsername('abc').then(function (user) {
        should.exist(user)
        user.has('username').should.be.ok()
        user.get('username').should.equal(username)
        done()
      })
      dbTracker.on('query', function (query) {
        query.method.should.equal('select')
        query.response([{
          id: 1,
          username: username
        }])
      })
    })
  })

  describe('_comparePassword', function () {
    it('should output true when raw password matches encrypted password', function (done) {
      const password = 'abc'
      const encryptedPassword = bcrypt.hashSync('abc')
      User._comparePassword(password, encryptedPassword, function (err, passwordValid) {
        if (err) done(err)
        passwordValid.should.be.ok()
        done()
      })
    })
  })
})
