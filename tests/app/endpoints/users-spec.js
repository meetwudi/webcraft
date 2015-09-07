var mknex = require('mock-knex')
var request = require('supertest')
var app = appRequire('app')
var should = require('should')
var dbTrakcer

describe('users endpoint', function () {
  beforeEach(function () {
    dbTrakcer = mknex.getTracker()
    dbTrakcer.install()
  })

  describe('POST /users', function () {
    it('should redirect to /login when succesfully registered', function (done) {
      var inserted = false
      dbTrakcer.on('query', function (query) {
        console.log(query)
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
        .send({ username: 'johnwu', password: 'abcdef' })
        .expect(302)
        .end(function (err, res) {
          should.not.exist(err)
          inserted.should.be.ok()
          res.header.location.should.equal('/login')
          done()
        })
    })
  })
})
