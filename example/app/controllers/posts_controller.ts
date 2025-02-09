import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async index({ inertia }: HttpContext) {
    // const posts = await Post.query().preload('comments')
    const posts = await Post.query().exec()

    for (const post of posts) {
      await post.load('comments')
    }

    return inertia.render('home', {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        comments: post.comments.map((comment) => ({
          id: comment.id,
          name: comment.name,
          content: comment.content,
        })),
      })),
    })
  }
}
