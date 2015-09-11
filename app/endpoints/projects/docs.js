var router = require('express').Router()
var passport = appRequire('app/init/passport')
var Project = appRequire('app/models/Project')
var Doc = appRequire('app/models/Doc')

router.use(passport.authenticate('jwt'))

var middlewares = {
  createDoc: function (req, res, next) {
    var docPromise = req.project.then(function (project) {
      var doc = new Doc(req.body.doc)
      doc.set('project_id', project.get('id'))
      return doc.save()
    })
    res.doc = docPromise
    res.status(201)
    next()
    return docPromise
  },

  getProject: function (req, res, next) {
    var projectId = req.params['project_id']
    var projectPromise = new Project({ id: projectId }).fetch()
    req.project = projectPromise
    next()
    return projectPromise
  },

  getProjectDocs: function (req, res, next) {
    var docsPromise = req.project.then(function (project) {
      return project.docs().fetch()
    })
    req.docs = docsPromise
    next()
    return docsPromise
  },

  displayDoc: function (req, res, next) {
    return req.doc.then(function (doc) {
      return res.json(doc.serialize())
    }, next)
  },

  displayDocs: function (req, res, next) {
    return req.docs.then(function (docs) {
      return res.json(docs.serialize())
    }, next)
  }
}

router.post('/projects/:project_id/docs',
  middlewares.getProject,
  middlewares.createDoc,
  middlewares.displayDoc)

router.get('/projects/:project_id/docs',
  middlewares.getProject,
  middlewares.getProjectDocs,
  middlewares.displayDocs)

module.exports = {
  router: router,
  middlewares: middlewares
}
