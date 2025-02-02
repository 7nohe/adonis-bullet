import type { BulletConfig } from './type.js'

export function defineConfig<T extends BulletConfig>(config: T): T {
  return config
}
