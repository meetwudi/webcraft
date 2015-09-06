var endpointsRouter = appRequire('app/endpoints')
var pagesRouter = appRequire('app/pages')

var swaggerDoc = appRequire('app/config/swagger/main.json')
var swaggerMetadata = require('swagger-tools/middleware/swagger-metadata')
var swaggerUI = require('swagger-tools/middleware/swagger-ui')
var swaggerRouter = require('swagger-tools/middleware/swagger-router')
var swaggerRouterConfig = {
  controllers: './app/endpoints',
  useStubs: process.env.SWAGGER_STUB || process.env.NODE_ENV === 'production' ? false : true
}

var configure = function (app) {
  app.use(endpointsRouter)
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(swaggerMetadata(swaggerDoc))
  // Route validated requests to appropriate controller
  app.use(swaggerRouter(options))
  // Serve the Swagger documents and Swagger UI
  app.use(swaggerUI)
  app.use(pagesRouter)
}

module.exports = {
  configure: configure
}
