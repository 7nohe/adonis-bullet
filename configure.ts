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
    console.warn('Could not add debug property to database config file. Please add it manually.')
    return
  }
  const dbConfigFile = await project.getSourceFileOrThrow(command.app.startPath('database.ts'))

  const callExpression = dbConfigFile.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression)
  const argument = callExpression.getArguments()[0]

  let isDebugPropertyAdded = false

  if (argument && argument.isKind(SyntaxKind.ObjectLiteralExpression)) {
    const objectLiteral = argument as ObjectLiteralExpression

    const connectionsProperty = objectLiteral.getProperty('connections')

    if (connectionsProperty?.isKind(SyntaxKind.PropertyAssignment)) {
      const connectionsObject = connectionsProperty.getInitializerIfKind(
        SyntaxKind.ObjectLiteralExpression
      )

      if (connectionsObject) {
        const property = connectionsObject.getFirstChildByKind(SyntaxKind.PropertyAssignment)
        if (property?.isKind(SyntaxKind.PropertyAssignment)) {
          const object = property.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression)

          if (object) {
            object.addPropertyAssignment({
              name: 'debug',
              initializer: (writer) => {
                writer.write('!app.inProduction')
              },
            })
            isDebugPropertyAdded = true
          }
        }
      }
    }
  }

  try {
    await dbConfigFile.emit()
  } catch (error) {
    isDebugPropertyAdded = false
  }

  if (!isDebugPropertyAdded) {
    console.warn('Could not add debug property to database config file. Please add it manually.')
  }
}
