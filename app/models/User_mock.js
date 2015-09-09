var extend = require('extend')

module.exports = {
  memberWide: {

  },

  classWide: {
    /**
     * Create a dummy user for testing
     *
     * @param  {object} opts - additional attributes
     * @return {User}      - dummy user
     */
    createDummyUser: function (additionalAttrs) {
      var attrs = {
        username: 'JohnWu',
        password: '$2a$10$gUz3HRg12bcaRspPuTOqjuqDzrbwyPxuDzJwPRYhY2eRRrM6A4nxq'
      }
      if (additionalAttrs) extend(attrs, additionalAttrs, function () {})
      return new this(attrs)
    }
  }
}
