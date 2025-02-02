import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.makeUsingStub(stubsRoot, 'start/bullet.stub', {})

  await codemods.makeUsingStub(stubsRoot, 'config/bullet.stub', {})

  await codemods.updateRcFile((transformer) => {
    transformer.addPreloadFile('#start/bullet')
    transformer.addProvider('@7nohe/adonis-bullet/provider')
  })

  await codemods.registerMiddleware('router', [
    {
      path: '@7nohe/adonis-bullet/middleware',
    },
  ])

  await codemods.defineEnvVariables({
    BULLET_THRESHOLD: 1,
  })

  await codemods.defineEnvValidations({
    variables: {
      BULLET_THRESHOLD: 'Env.schema.number.optional()',
    },
    leadingComment: 'Variables for @7nohe/adonis-bullet',
  })
}
