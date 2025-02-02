import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { createHash } from 'node:crypto'
import { EventsList as LucidEventsList } from '@adonisjs/lucid/types/events'
import { BulletConfig, BulletResult } from './type.js'
import { EmitterService } from '@adonisjs/core/types'

declare module '@adonisjs/core/types' {
  interface EventsList extends LucidEventsList {
    'bullet:detected': BulletResult
  }
}

export default class BulletMiddleware {
  #config: BulletConfig
  #emitter: EmitterService

  constructor(config: BulletConfig, emitter: EmitterService) {
    this.#config = config
    this.#emitter = emitter
  }

  async handle(_ctx: HttpContext, next: NextFn) {
    const { threshold = 1, enabled = false } = this.#config

    if (!enabled) {
      return next()
    }

    const queries = new Map<string, BulletResult>()

    const unsubscribe = this.#emitter.on('db:query', async (query) => {
      let model = ''
      let relatedModel = ''
      let relationType = ''

      if ('relation' in query) {
        const relation = query.relation as {
          model: string
          relatedModel: string
          type: string
        }
        model = relation.model
        relatedModel = relation.relatedModel
        relationType = relation.type
      }

      const hash = createHash('md5')
      const key = hash.update(`${query.sql}:${model}:${relatedModel}`).digest('hex')
      const prevQuery = queries.get(key)
      const count = prevQuery ? prevQuery.count + 1 : 1
      const duration = query.duration![1] - query.duration![0]
      const time = prevQuery ? prevQuery.time + duration : duration
      queries.set(key, {
        count,
        time,
        query: query.sql,
        model,
        relatedModel,
        relationType,
      })
    })

    const output = await next()

    unsubscribe()
    queries.forEach((q) => {
      if (q.count > threshold) {
        this.#emitter.emit('bullet:detected', q)
      }
    })
    return output
  }
}
