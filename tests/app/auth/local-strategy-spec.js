var localStrategy = appRequire('app/auth/local-strategy')
var _authenticateUser = localStrategy._authenticateUser
var bcrypt = require('bcrypt-nodejs')
var dbTracker
var should = require('should')

describe('localStrategy _authenticateUser', function () {
  beforeEach(function () {
    dbTracker = require('mock-knex').getTracker()
    dbTracker.install()
  })
  afterEach(function () {
    dbTracker.uninstall()
  })

  it('should authenticate user when username and password are valid, otherwise not', function () {
    var mockedUsers = [
      { id: 2, username: 'Esther', password: bcrypt.hashSync('abcd') }
    ]
    dbTracker.on('query', function (query) {
      query.response(mockedUsers)
    })

    _authenticateUser('Esther', 'abcd', function (err, user, message) {
      should.not.exist(err)
      should.exist(user)
      user.should.be.ok()
      user.get('username').should.equal('Esther')
    })

    _authenticateUser('Esther', 'abd', function (err, user, message) {
      should.not.exist(err)
      should.exist(user)
      message.should.equal('Incorrect password')
      user.should.not.be.ok()
    })
  })
})
