import type { ApplicationService } from '@adonisjs/core/types'
import { BulletConfig } from '../src/type.js'
import BulletMiddleware from '../src/bullet_middleware.js'

export default class BulletProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    const config = this.app.config.get<BulletConfig>('bullet', {})

    this.app.container.singleton(BulletMiddleware, async (resolver) => {
      const emitter = await resolver.make('emitter')
      return new BulletMiddleware(config, emitter)
    })
  }
}
