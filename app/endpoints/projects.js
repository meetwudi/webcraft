var router = require('express').Router()
var passport = appRequire('app/init/passport')
var Project = appRequire('app/models/Project')

router.use(passport.authenticate('jwt'))

var middlewares = {
  createProject: function (req, res, next) {
    var projectPromise = Project.createProject(req.user)
    req.project = projectPromise
    res.status(201)
    next()
    return projectPromise
  },

  destroyProject: function (req, res, next) {
    // TODO: test this
    req.project.then(function (project) {
        if (project) return project.destroy()
      }).then(function () {
        res.status(200).end()
      }, next)
  },

  displayProject: function (req, res, next) {
    return req.project.then(function (project) {
      res.json(project.serialize())
    }, next)
  },

  displayProjects: function (req, res, next) {
    return req.projects.then(function (projects) {
      res.json(projects.serialize())
    }, next)
  },

  findUserProject: function (req, res, next) {
    var projectId = req.params.id
    // TODO: refactor into models
    var project = req.user.projects().query({ where: { id: projectId } }).fetchOne()
    req.project = Promise.resolve(project)
    next()
    return req.project
  },

  getProjects: function (req, res, next) {
    var projectsPromise = req.user.projects().fetch()
    req.projects = projectsPromise
    next()
    return projectsPromise
  }
}

router.get('/projects', middlewares.getProjects, middlewares.displayProjects)
router.post('/projects', middlewares.createProject, middlewares.displayProject)
router.delete('/projects/:id', middlewares.findUserProject, middlewares.destroyProject)

module.exports = {
  middlewares: middlewares,
  router
}
