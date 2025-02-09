import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'
import { ObjectLiteralExpression, SyntaxKind } from 'ts-morph'

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

  const project = await codemods.getTsMorphProject()
  if (!project) {
    command.logger.warning(
      'Could not find project to add `debug` property to config/database.ts. Please add it manually.'
    )
    return
  }

  try {
    let isDebugPropertyAdded = false
    const dbConfigFile = await project.getSourceFileOrThrow(command.app.configPath('database.ts'))

    const callExpression = dbConfigFile.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression)
    const argument = callExpression.getArguments()[0]

    if (!(argument && argument.isKind(SyntaxKind.ObjectLiteralExpression))) {
      command.logger.warning(
        'Could not find object literal expression to add `debug` property to config/database.ts. Please add it manually.'
      )
      return
    }

    const objectLiteral = argument as ObjectLiteralExpression

    const connectionsProperty = objectLiteral.getProperty('connections')

    if (!connectionsProperty?.isKind(SyntaxKind.PropertyAssignment)) {
      command.logger.warning(
        'Could not find connections property to add `debug` property to config/database.ts. Please add it manually.'
      )
      return
    }
    const connectionsObject = connectionsProperty.getInitializerIfKind(
      SyntaxKind.ObjectLiteralExpression
    )

    if (!connectionsObject) {
      command.logger.warning(
        'Could not find connections object to add `debug` property to config/database.ts. Please add it manually.'
      )
      return
    }
    const property = connectionsObject.getFirstChildByKind(SyntaxKind.PropertyAssignment)
    if (!property?.isKind(SyntaxKind.PropertyAssignment)) {
      command.logger.warning(
        'Could not find property to add `debug` property to config/database.ts. Please add it manually.'
      )
      return
    }

    const object = property.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression)

    if (!object) {
      command.logger.warning(
        'Could not find connection object to add `debug` property to config/database.ts. Please add it manually.'
      )
      return
    }

    if (object.getProperty('debug')) {
      command.logger.warning(
        'The `debug` property already exists in config/database.ts. Skipping adding it. Make sure to set it to true to enable Bullet.'
      )
      return
    }

    object.addPropertyAssignment({
      name: 'debug',
      initializer: (writer) => {
        writer.write('!app.inProduction')
      },
    })
    isDebugPropertyAdded = true

    if (!isDebugPropertyAdded) {
      command.logger.warning('Failed to update config/database.ts. Please add it manually.')
    }

    await dbConfigFile.save()
    command.logger.success('update config/database.ts')
  } catch (error) {
    command.logger.warning(
      'Could not add `debug` property to config/database.ts. Please add it manually.'
    )
  }
}
