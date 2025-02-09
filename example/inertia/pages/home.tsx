import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import type PostsController from '#controllers/posts_controller'

export default function Home(props: InferPageProps<PostsController, 'index'>) {
  const { posts } = props
  return (
    <div className="container mx-auto p-4">
      <Head title="Homepage" />
      <h1 className="text-4xl font-bold mb-4">Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="mb-4">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="text-base">{post.content}</p>
          <h3 className="text-lg font-bold">Comments:</h3>
          <ul>
            {post.comments.map((comment) => (
              <li key={comment.id} className="text-sm ml-4">
                <strong>{comment.name}</strong>: {comment.content}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
