var User = appRequire('app/models/User')
var dbTracker = require('mock-knex').getTracker()
var bcrypt = require('bcrypt-nodejs')
var should = require('should')

describe('User', function () {
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

    it('should output false when raw password does not match encrypted password', function (done) {
      const password = 'abcd'
      const encryptedPassword = bcrypt.hashSync('abc')
      User._comparePassword(password, encryptedPassword, function (err, passwordValid) {
        if (err) done(err)
        passwordValid.should.not.be.ok()
        done()
      })
    })
  })

  describe('getUserByUsername', function () {
    it('should resolves a correct user if the username matches any user', function (done) {
      dbTracker.install()
      const username = 'abc'

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
})

describe('user', function () {
  describe('validatePassword', function () {
    it('should resolve true when passwords match', function (done) {
      const password = 'abc'
      User.forge({ id: 1, username: 'diwu', password: bcrypt.hashSync(password) })
        .validatePassword(password)
        .then(function (isPasswordValid) {
          isPasswordValid.should.be.ok()
          done()
        })
    })

    it('should resolve false when passwords does not match', function (done) {
      const password = 'abc'
      User.forge({ id: 1, username: 'diwu', password: bcrypt.hashSync(password) })
        .validatePassword(password + 'd')
        .then(function (isPasswordValid) {
          isPasswordValid.should.not.be.ok()
          done()
        })
    })
  })
})
