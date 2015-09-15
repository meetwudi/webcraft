var app = appRequire('app')
var request = require('supertest')
var bcrypt = require('bcrypt-nodejs')
var should = require('should')
var dbTracker

describe('POST /endpoints/session', function () {
  beforeEach(function () {
    dbTracker = require('mock-knex').getTracker()
    dbTracker.install()
  })
  afterEach(function () {
    dbTracker.uninstall()
  })

  it('should return a valid jwt token when successful login', function (done) {
    var username = 'johnwu'
    var password = 'damn good password'
    var encryptedPassword = bcrypt.hashSync(password)
    dbTracker.on('query', function (query) {
      query.method.should.equal('select')
      query.response([ { id: 1, username: username, password: encryptedPassword } ])
    })
    request(app)
      .post('/endpoints/session')
      .send({
        username: username,
        password: password
      })
      // Redirected
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err)
        var jwtobj = res.body
        should.exist(jwtobj)
        jwtobj.should.have.property('jwt')
        jwtobj['jwt'].should.be.an.instanceOf(String)
        done()
      })
  })

  it('should return 401 if user provides wrong password', function (done) {
    var username = 'johnwu'
    var password = 'damn good password'
    dbTracker.on('query', function (query) {
      query.method.should.equal('select')
      query.response([ { id: 1, username: username, password: bcrypt.hashSync('something else') } ])
    })
    request(app)
      .post('/endpoints/session')
      .send({
        username: username,
        password: password
      })
      .expect(401)
      .end(function (err, res) {
        should.not.exist(err)
        done()
      })
  })

  it('should return 401 if user provides wrong username', function (done) {
    var username = 'johnwu'
    var password = 'damn good password'
    dbTracker.on('query', function (query) {
      query.method.should.equal('select')
      query.response([])
    })
    request(app)
      .post('/endpoints/session')
      .send({
        username: username,
        password: password
      })
      .expect(401)
      .end(function (err, res) {
        should.not.exist(err)
        done()
      })
  })
})
