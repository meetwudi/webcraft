var httpMocks = require('node-mocks-http')
var User = appRequire('app/models/User')
var Project = appRequire('app/models/Project')
var should = require('should')
var projectEndpoints = appRequire('app/endpoints/projects')
var databaseConfig = appRequire('app/config/database')
var dataRules = appRequire('app/config/data-rules')
var Promise = require('bluebird')
var dbTracker

describe('projects endpoint', function () {
  beforeEach(function () {
    dbTracker = require('mock-knex').getTracker()
    dbTracker.install()
  })

  afterEach(function () {
    dbTracker.uninstall()
  })

  describe('getProjects middleware', function () {
    it('should resolve with all projects of the current user', function (done) {
      dbTracker.on('query', function (query) {
        if (query.sql === 'select "projects".* from "projects" where "projects"."user_id" = ?') {
          query.response([
            { id: 1, user_id: 1, name: 'dummyproject' },
            { id: 2, user_id: 1, name: 'dummyproject2' }
          ])
        }
      })

      var user = User.createDummyUser({
        id: 1
      })
      var httpRequest = httpMocks.createRequest()
      var httpResponse = httpMocks.createResponse()
      httpRequest.user = user
      var getProjectsMiddleware = projectEndpoints.middlewares.getProjects
      getProjectsMiddleware(httpRequest, httpResponse, function () { })
        .then(function (projects) {
          should.exist(projects)
          var projectsObj = projects.serialize()
          projectsObj.should.have.length(2)
          done()
        }, function (err) {
          should.not.exist(err)
        })
    })
  })

  describe('createProject middleware', function () {
    it('should resolve with the newly created project', function (done) {
      dbTracker.on('query', function (query) {
        if (query.sql === 'select count(*) as "count" from "projects"') {
          query.response([{ count: 0 }])
        }
        if (query.sql === 'insert into "projects" ("name", "user_id") values (?, ?) returning "id"') {
          query.response([1])
        }
        if (query.sql === 'update "projects" set "id" = ?, "user_id" = ? where "id" = ?') {
          query.response(1)
        }
      })

      var user = User.createDummyUser({
        id: 1
      })
      var httpRequest = httpMocks.createRequest()
      var httpResponse = httpMocks.createResponse()
      httpRequest.user = user
      var createProjectMiddleware = projectEndpoints.middlewares.createProject
      createProjectMiddleware(httpRequest, httpResponse, function () { })
        .then(function (project) {
          project.get('user_id').should.equal(1)
          project.get('id').should.equal(1)
          project.get('name').should.be.an.instanceOf(String)
          project.get('name').should.have.length(dataRules.DEFAULT_PROJECT_NAME_LENGTH)
          done()
        })
    })
  })

  describe('displayProject middleware', function () {
    it('should display a project in json format', function (done) {
      dbTracker.on('query', function (query) {
        if (query.sql === 'update "projects" set "id" = ?, "name" = ?, "user_id" = ? where "id" = ?') {
          query.response(1)
        }
      })

      var project = Project.createDummyProject({id: 1, name: 'john wu', user_id: 1})
      var displayProjectMiddleware = projectEndpoints.middlewares.displayProject
      var httpRequest = httpMocks.createRequest()
      var httpResponse = httpMocks.createResponse()
      httpRequest.project = project.save()
      displayProjectMiddleware(httpRequest, httpResponse, function () { })
        .then(function () {
          httpResponse.statusCode.should.equal(200)
          var result = JSON.parse(httpResponse._getData())
          result.should.have.properties(databaseConfig.RROJECTS_TABLE_COLUMNS)
          done()
        })
    })
  })

  describe('displayProjects middleware', function () {
    it('should display a list of projects', function (done) {
      var projects = Project.collection()
      projects.add([
        Project.createDummyProject({id: 1, name: 'john wu proj1', user_id: 1}),
        Project.createDummyProject({id: 2, name: 'john wu proj2', user_id: 1})
      ])
      var httpRequest = httpMocks.createRequest()
      var httpResponse = httpMocks.createResponse()
      httpRequest.projects = Promise.resolve(projects)
      var displayProjectsMiddleware = projectEndpoints.middlewares.displayProjects
      displayProjectsMiddleware(httpRequest, httpResponse, function () { })
        .then(function () {
          httpResponse.statusCode.should.equal(200)
          var result = JSON.parse(httpResponse._getData())
          result.should.have.lengthOf(2)
          done()
        })
    })
  })

  describe('findUserProject middleware', function () {
    it('should get the correct project', function (done) {
      dbTracker.on('query', function (query) {
        query.response([{id: 1, name: 'johnwuproject', user_id: 1}])
      })
      var user = User.createDummyUser({
        id: 1
      })
      var httpRequest = httpMocks.createRequest()
      var httpResponse = httpMocks.createResponse()
      httpRequest.user = user
      httpRequest.params = { id: 1 } // project id
      var findUserProjectMiddleware = projectEndpoints.middlewares.findUserProject
      findUserProjectMiddleware(httpRequest, httpResponse, function () { })
        .then(function (project) {
          should.exist(project)
          project.get('id').should.equal(1)
          project.get('user_id').should.equal(1)
          project.get('name').should.equal('johnwuproject')
          done()
        }, done)
    })
  })
})
