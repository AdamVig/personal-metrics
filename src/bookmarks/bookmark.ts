export interface Bookmark {
  /** A URL. */
  href: string

  /** Title. */
  description: string

  /** Extended description. */
  extended: string

  /** Change detection signature. */
  meta: string

  /** MD5 hash. */
  hash: string

  /** Creation time. */
  time: Date

  /** Whether bookmark is public or not. */
  shared: 'yes' | 'no'

  /** Whether bookmark is unread or not. */
  toread: 'yes' | 'no'

  /** Space-delimited list of tags. */
  tags: string
}
