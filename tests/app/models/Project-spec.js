var Project = appRequire('app/models/Project')
var User = appRequire('app/models/User')
var dbTracker = require('mock-knex').getTracker()
var should = require('should')
var dataRules = appRequire('app/config/data-rules')

describe('Project Model', function () {
  describe('#_generateName', function () {
    it('should create a name correctly', function (done) {
      var mockedUser = {}
      var remainCountReturnsTrue = 3
      mockedUser.hasProjectName = function () {
        if (remainCountReturnsTrue--) return Promise.resolve(true)
        else return Promise.resolve(false)
      }
      Project._generateName(mockedUser).then(function (projectName) {
        should.exist(projectName)
        projectName.should.be.an.instanceOf(String)
        projectName.should.have.length(dataRules.DEFAULT_PROJECT_NAME_LENGTH)
        done()
      }, function (err) {
        should.not.exist(err)
      })
    })
  })

  describe('#createProject', function () {
    it('should create a project with a random name (with specific length)', function (done) {
      dbTracker.install()
      dbTracker.on('query', function (query) {
        if (query.method === 'insert') {
          return query.response([{ id: 1}])
        }
        if (query.sql === 'select "users".* from "users" where "users"."id" = ? limit ?') {
          return query.response([{ id: 1, username: "abc" }])
        }
        if (query.sql === 'select count(*) as "count" from "projects"') {
          return query.response([{ count: 0 }])
        }
      })
      Project.createProject({
        user_id: 1
      }).then(function (project) {
        should.exist(project)
        project.should.be.an.instanceOf(Project)
        project.get('name').should.be.ok()
        project.get('name').should.have.length(dataRules.DEFAULT_PROJECT_NAME_LENGTH)
        done()
      }, function (err) {
        should.not.exist(err)
      })
    })
  })
})
