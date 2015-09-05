module.exports = function () {
  return function (req, res, next) {
    if (req.user) {
      res.cookie(process.env.JWT_COOKIE_KEY, req.user.getJWT(), {
        httpOnly: true
      })
      return res.redirect('/')
    }
    else return res.redirect('/login')
  }
}
