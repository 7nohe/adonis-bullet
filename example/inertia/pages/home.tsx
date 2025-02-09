import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import type PostsController from '#controllers/posts_controller'

export default function Home(props: InferPageProps<PostsController, 'index'>) {
  const { posts } = props
  return (
    <>
      <Head title="Homepage" />
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <ul>
            {post.comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.name}</strong>: {comment.content}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}
