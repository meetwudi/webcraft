var mknex = require('mock-knex')
var request = require('supertest')
var app = appRequire('app')
var should = require('should')
var userEndpoints = appRequire('app/endpoints/users')
var httpMocks = require('node-mocks-http')
var User = appRequire('app/models/User')
var dbTracker

describe('users endpoint', function () {
  beforeEach(function () {
    dbTracker = mknex.getTracker()
    dbTracker.install()
  })
  afterEach(function () {
    dbTracker.uninstall()
  })

  describe('POST /users', function () {
    it('should redirect to /login when succesfully registered', function (done) {
      var inserted = false
      dbTracker.on('query', function (query) {
        if (query.method === 'insert') {
          inserted = true
          query.response(1)
        }
        if (query.method === 'select') {
          query.response([{count: 0}])
        }
      })
      request(app)
        .post('/endpoints/users')
        .send({ username: 'johnwu', password: 'abcdef', confirmed_password: 'abcdef' })
        .expect(302)
        .end(function (err, res) {
          should.not.exist(err)
          inserted.should.be.ok()
          res.header.location.should.equal('/login')
          done()
        })
    })

    it('should redirect to /register when not succesfully registered', function (done) {
      var inserted = false
      dbTracker.on('query', function (query) {
        if (query.method === 'insert') {
          inserted = true
          query.response(1)
        }
        if (query.method === 'select') {
          query.response([{count: 1}])
        }
      })
      request(app)
        .post('/endpoints/users')
        .send({ username: 'johnwu', password: 'abcdef', confirmed_password: 'abcdef' })
        .expect(302)
        .end(function (err, res) {
          should.not.exist(err)
          inserted.should.not.be.ok()
          res.header.location.should.equal('/register')
          done()
        })
    })
  })

  describe('displayUserProfile middleware', function () {
    it('should response with user profile without password', function (done) {
      var displayUserProfileMiddleware = userEndpoints.middlewares.displayUserProfile
      var request = httpMocks.createRequest()
      var response = httpMocks.createResponse()
      request.user = Promise.resolve(User.createDummyUser({ id: 1 }))
      displayUserProfileMiddleware(request, response, function () {})
        .then(function () {
          var result = JSON.parse(response._getData())
          result.should.have.properties(['id', 'username'])
          result.should.not.have.property('password')
          done()
        })
    })
  })
})
