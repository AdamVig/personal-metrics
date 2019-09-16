import { Entity, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class BookmarkTagCount {
  @CreateDateColumn({ update: false })
  public time!: Date

  /** A bookmark tag. */
  @Column({ type: 'text', unique: true, primary: true })
  public tag!: string

  /** Number of bookmarks with this tag. */
  @Column('int')
  public count = 0

  /** Create many instances of the class from a map of tags to counts. */
  public static createManyFromMap(tagCounts: Map<string, number>): BookmarkTagCount[] {
    const result: BookmarkTagCount[] = []
    for (const [tag, count] of tagCounts) {
      const tagCount = new BookmarkTagCount()
      tagCount.tag = tag
      tagCount.count = count
      result.push(tagCount)
    }
    return result
  }
}
