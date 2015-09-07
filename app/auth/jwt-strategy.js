var JWTStrategy = require('passport-jwt').Strategy
var User = appRequire('app/models/User')

var jwtOptions = {
  secretOrKey: process.env.JWT_SECRET
}

var _authenticateUser = function (jwtPayload, done) {
  if (!jwtPayload || !jwtPayload['user_id']) {
    return done(null, false)
  }
  new User({ id: jwtPayload['user_id'] })
    .fetch()
    .then(function (user) {
      if (user) done(null, user)
      else done(null, false)
    }, done)
}

module.exports = {
  jwtStrategy: new JWTStrategy(jwtOptions, _authenticateUser),
  _authenticateUser: _authenticateUser
}
