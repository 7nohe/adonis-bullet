import { PostFactory } from '#database/factories/post_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    PostFactory.with('comments', 3).createMany(10)
  }
}
