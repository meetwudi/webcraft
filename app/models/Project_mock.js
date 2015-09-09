var extend = require('extend')

module.exports = {
  memberWide: {

  },

  classWide: {
    /**
     * Create a dummy project for testing
     *
     * @param  {object} opts - additional attributes
     * @return {Project}      - dummy project
     */
    createDummyProject: function (additionalAttrs) {
      var attrs = {
        name: 'dummy project'
      }
      if (additionalAttrs) extend(attrs, additionalAttrs, function () {})
      return new this(attrs)
    }
  }
}
