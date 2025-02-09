import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'

export const CommentFactory = factory
  .define(Comment, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      content: faker.lorem.paragraphs(3),
    }
  })
  .build()
