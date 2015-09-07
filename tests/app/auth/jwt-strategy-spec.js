var _authenticateUser = appRequire('app/auth/jwt-strategy')._authenticateUser
var User = appRequire('app/models/User')
var should = require('should')
var dbTracker

describe('jwtStrategy', function () {
  beforeEach(function () {
    dbTracker = require('mock-knex').getTracker()
    dbTracker.install()
  })
  describe('_authenticateUser', function () {
    it('should get user id from jwt payload and return the user model', function (done) {
      dbTracker.on('query', function (query) {
        query.method.should.equal('select')
        query.response([ { id: 1, username: 'john' } ])
      })
      _authenticateUser({
        user_id: 1
      }, function (err, user, message) {
        should.not.exist(err)
        user.should.be.an.instanceOf(User)
        user.get('id').should.equal(1)
        done()
      })
    })

    it('should return false it jwtPayload is not defined or does not have user_id property', function (done) {
      _authenticateUser({}, function (err, user) {
        should.not.exist(err)
        user.should.be.exactly(false)
        done()
      })
    })
  })
})
