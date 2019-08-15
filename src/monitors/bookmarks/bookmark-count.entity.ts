import { Entity, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class BookmarkCount {
  @CreateDateColumn({ unique: true, update: false, primary: true })
  public time!: Date

  /** Count of bookmarks. */
  @Column('int')
  public total = 0

  /** Count of unread bookmarks. */
  @Column('int')
  public unread = 0

  /** Count of private bookmarks. */
  @Column('int')
  public private = 0
}
