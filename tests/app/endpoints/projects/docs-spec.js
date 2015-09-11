var httpMocks = require('node-mocks-http')
var should = require('should')
var docsEndpoints = appRequire('app/endpoints/projects/docs')
var Project = appRequire('app/models/Project')
var Promise = require('bluebird')
var Doc = appRequire('app/models/Doc')
var databaseConfig = appRequire('app/config/database')
var dbTracker

describe('Projects-Docs endpoints', function () {
  beforeEach(function () {
    dbTracker = require('mock-knex').getTracker()
    dbTracker.install()
  })

  afterEach(function () {
    dbTracker.uninstall()
  })

  describe('getProject', function () {
    it('should attach req.project (Promise)', function (done) {
      dbTracker.on('query', function (query) {
        if (query.method === 'select') {
          return query.response([
            { id: 1, user_id: 1, name: 'johnwu project' }
          ])
        }
        done(new Error('Unexpected query: ' + query.sql))
      })

      var getProjectMiddleware = docsEndpoints.middlewares.getProject
      var request = httpMocks.createRequest({
        params: {
          project_id: 1
        }
      })
      var response = httpMocks.createResponse()
      getProjectMiddleware(request, response, function () { })
        .then(function () {
          should.exist(request.project)
          return request.project
        })
        .then(function (project) {
          should.exist(project)
          project.should.be.an.instanceOf(Project)
          project.get('name').should.equal('johnwu project')
          done()
        }, done)
    })
  })

  describe('getProjectDocs middleware', function () {
    it('should resolve with docs of the project', function (done) {
      dbTracker.on('query', function (query) {
        if (query.sql === 'select "projects".* from "projects" where "projects"."id" = ? limit ?') {
          return query.response([
            { id: 1, name: 'johnwu project', user_id: 1 }
          ])
        }
        if (query.sql === 'select "docs".* from "docs" where "docs"."project_id" = ?') {
          return query.response([
            { id: 1, project_id: 1, content: 'html', title: 'index.html' },
            { id: 2, project_id: 1, content: 'just css', title: 'style.css' }
          ])
        }
        done(new Error(`Unexpected query: ${query.sql}`))
      })

      var getProjectDocsMiddleware = docsEndpoints.middlewares.getProjectDocs
      var request = httpMocks.createRequest()
      var response = httpMocks.createResponse()
      request.project = new Project({ id: 1 }).fetch()
      getProjectDocsMiddleware(request, response, function () {})
        .then(function () {
          should.exist(request.docs)
          return request.docs
        })
        .then(function (docs) {
          var docsArray = docs.serialize()
          docsArray.should.be.an.instanceOf(Array)
          docsArray.should.have.length(2)
          docsArray.forEach(function (docObject) {
            docObject.should.have.properties(databaseConfig.DOCS_TABLE_COLUMNS)
          })
          done()
        }, done)
    })
  })

  describe('displayDoc middleware', function () {
    it('should render doc json', function (done) {
      var request = httpMocks.createRequest()
      var response = httpMocks.createResponse()
      request.doc = Promise.resolve(Doc.forge({ id: 1, content: 'html', title: 'index.html', project_id: 1 }))
      var displayDocMiddleware = docsEndpoints.middlewares.displayDoc
      displayDocMiddleware(request, response, function () {})
        .then(function () {
          var data = JSON.parse(response._getData())
          data.should.have.properties(databaseConfig.DOCS_TABLE_COLUMNS)
          done()
        })
    })
  })

  describe('displayDocs middleware', function () {
    it('should render docs json', function (done) {
      var request = httpMocks.createRequest()
      var response = httpMocks.createResponse()
      var docsCollection = Doc.collection()
      docsCollection.add([
        { id: 1, content: 'html', title: 'index.html', project_id: 1 },
        { id: 2, content: 'css content', title: 'style.css', project_id: 1 }
      ])
      request.docs = Promise.resolve(docsCollection)
      var displayDocsMiddleware = docsEndpoints.middlewares.displayDocs
      displayDocsMiddleware(request, response, function () {})
        .then(function () {
          var data = JSON.parse(response._getData())
          should.exist(data)
          data.should.be.an.instanceOf(Array)
          data.should.have.length(2)
          data.forEach(function (docObject) {
            docObject.should.have.properties(databaseConfig.DOCS_TABLE_COLUMNS)
          })
          done()
        }, done)
    })
  })

  describe('createDoc', function () {
    it('should create a doc and attach to project', function (done) {
      dbTracker.on('query', function (query) {
        if (query.sql === 'select "projects".* from "projects" where "projects"."id" = ? limit ?') {
          return query.response([
            { id: 1, name: 'johnwu project', user_id: 1 }
          ])
        }
        if (query.sql === 'insert into "docs" ("content", "project_id", "title") values (?, ?, ?) returning "id"') {
          return query.response([1])
        }
        done(new Error(`Unexpected query: ${query.sql}`))
      })

      var request = httpMocks.createRequest({
        body: {
          doc: {
            content: '',
            title: 'index.html'
          }
        }
      })
      var response = httpMocks.createResponse()
      request.project = new Project({ id: 1 }).fetch()
      var createDocMiddleware = docsEndpoints.middlewares.createDoc
      createDocMiddleware(request, response, function () {})
        .then(function () {
          should.exist(response.doc)
          return response.doc
        })
        .then(function (doc) {
          response.statusCode.should.equal(201)
          doc.get('title').should.equal('index.html')
          doc.get('project_id').should.equal(1)
          done()
        }, done)
    })
  })
})
