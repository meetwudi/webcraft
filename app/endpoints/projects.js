var router = require('express').Router()
var passport = appRequire('app/init/passport')
var Project = appRequire('app/models/Project')

router.use(passport.authenticate('jwt'))

var middlewares = {
  getProjects: function (req, res, next) {
    var projectsPromise = req.user.projects().fetch()
    req.projects = projectsPromise
    next()
    return projectsPromise
  },

  createProject: function (req, res, next) {
    var projectPromise = new Project(req.body.project).save()
      .then(function (project) {
        return project.set('user_id', req.user.get('id'))
          .save()
      })
    req.project = projectPromise
    res.status(201)
    next()
    return projectPromise
  },

  displayProject: function (req, res, next) {
    return req.project.then(function (project) {
      res.json(project.serialize())
    })
  },

  displayProjects: function (req, res, next) {
    return req.projects.then(function (projects) {
      res.json(projects.serialize())
    })
  }
}

router.get('/project', middlewares.getProjects, middlewares.displayProjects)
router.post('/project', middlewares.createProject, middlewares.displayProject)

module.exports = {
  middlewares: middlewares,
  router
}
