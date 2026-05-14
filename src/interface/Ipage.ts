export default interface IPage<T> {

  records?: T[]

  total?: number

  size?: number

  current?: number

  orders?: unknown[]

  optimizeCountSql?: boolean

  searchCount?: boolean

  optimizeJoinOfCountSql?: boolean

  maxLimit?: number

  countId?: string
}
