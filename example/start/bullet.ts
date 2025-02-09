import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

emitter.on('bullet:detected', function (query) {
  logger.warn('N + 1 query detected: %j', query)
})
