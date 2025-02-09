## AdonisJS Bullet

AdonisJS Bullet is a package that helps to kill N+1 queries in your AdonisJS application.

## Installation

```bash
node ace add @7nohe/adonis-bullet
```

Usually, the `config/database.ts` file is updated when this command is executed. If it is not updated, please enable [debug mode](https://lucid.adonisjs.com/docs/debugging#debugging) manually.

You can also manually modify `config/database.ts` to enable debug mode in non-production environments.

```ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import app from '@adonisjs/core/services/app'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      debug: !app.inProduction,
    },
  },
})
```

## Configuration

You can modify `config/bullet.ts` to enable/disable N+1 query detection or set the threshold for detecting queries. By setting the `BULLET_THRESHOLD` environment variable, you can change the threshold.

```ts
export default defineConfig({
  /**
   * Enable or disable Bullet
   */
  enabled: !app.inProduction,

  /**
   * The threshold level for detecting N+1 queries.
   * If a relation query is executed more than this number of times, the detector will notify you.
   **/
  threshold: env.get('BULLET_THRESHOLD', 1),
})
```

## Customize N+1 query detection event

Optionally, you can modify `start/bullet.ts` to customize the N+1 query detection event. The `@7nohe/adonis-bullet` package emits the `bullet:detected` event when an N+1 query is detected.

```ts
emitter.on('bullet:detected', function (query) {
  logger.warn('N + 1 query detected: %j', query)
})
```
