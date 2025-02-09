import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'
import { CommentFactory } from './comment_factory.js'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
    }
  })
  .relation('comments', () => CommentFactory)
  .build()
