var dbTracker = require('mock-knex').getTracker()
var app = appRequire('app')
var request = require('supertest')
var bcrypt = require('bcrypt-nodejs')
var should = require('should')

describe('POST /endpoints/login', function () {
  it('should store a valid jwt token in cookie when successful login', function (done) {
    var username = 'johnwu'
    var password = 'damn good password'
    var encryptedPassword = bcrypt.hashSync(password)
    dbTracker.install()
    dbTracker.on('query', function (query) {
      query.method.should.equal('select')
      query.response([ { id: 1, username: username, password: encryptedPassword } ])
    })
    request(app)
      .post('/endpoints/login')
      .send({
        username: username,
        password: password
      })
      // Redirected
      .expect(302)
      .end(function (err, res) {
        should.not.exist(err)
        res.header.location.should.equal('/')
        res.header['set-cookie'].should.be.ok()
        res.header['set-cookie'][0].should.match(/^jwt/)
        res.header['set-cookie'][0].should.match(/HttpOnly/)
        done()
      })
  })

  it('should redirect to /login if user fails to login', function (done) {
    var username = 'johnwu'
    var password = 'damn good password'
    var encryptedPassword = bcrypt.hashSync(password)
    dbTracker.install()
    dbTracker.on('query', function (query) {
      query.method.should.equal('select')
      query.response([ { id: 1, username: username, password: bcrypt.hashSync('something else') } ])
    })
    request(app)
      .post('/endpoints/login')
      .send({
        username: username,
        password: password
      })
      // Redirected
      .expect(302)
      .end(function (err, res) {
        should.not.exist(err)
        res.header.location.should.equal('/login')
        done()
      })
  })
})
