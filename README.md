## AdonisJS Bullet

AdonisJS Bullet is a package that helps to kill N+1 queries in your AdonisJS application.

## Installation

```bash
node ace add @7nohe/adonis-bullet
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
