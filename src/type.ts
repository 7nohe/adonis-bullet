export type BulletConfig = {
  enabled?: boolean
  threshold?: number
}

export type BulletResult = {
  count: number
  time: number
  query: string
  model: string
  relatedModel: string
  relationType: string
}
