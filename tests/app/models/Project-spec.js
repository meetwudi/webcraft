var Project = appRequire('app/models/Project')
var User = appRequire('app/models/User')
var should = require('should')
var dataRules = appRequire('app/config/data-rules')
var dbTracker

describe('Project Model', function () {
  beforeEach(function () {
    dbTracker = require('mock-knex').getTracker()
    dbTracker.install()
  })
  afterEach(function () {
    dbTracker.uninstall()
  })

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
      dbTracker.on('query', function (query) {
        if (query.sql === 'select count(*) as "count" from "projects"') {
          query.response([{ count: 0 }])
        }
        if (query.sql === 'insert into "projects" ("name", "user_id") values (?, ?) returning "id"') {
          query.response([1])
        }
      })
      Project.createProject(User.forge({ id: 1 }))
        .then(function (project) {
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
