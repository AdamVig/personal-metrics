import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { VError } from 'verror'

import { Bookmark } from './bookmark'
import { BookmarkCount } from './bookmark-count.entity'
import { BookmarkTagCount } from './bookmark-tag-count.entity'
import { LogFactory, Logger } from '../../logger/log-factory'
import { PinboardClient } from './pinboard-client'
import { Monitor } from '../../monitors/monitor'

@Injectable()
export class BookmarksMonitor implements Monitor {
  /** Ninety minutes. */
  public readonly interval = 5400
  private readonly log: Logger

  public constructor(
    log: LogFactory,
    private readonly pinboardClient: PinboardClient,
    @InjectRepository(BookmarkCount)
    private readonly bookmarkRepository: Repository<BookmarkCount>,
    @InjectRepository(BookmarkTagCount)
    private readonly bookmarkTagCountRepository: Repository<BookmarkTagCount>,
  ) {
    this.log = log.child('BookmarksMonitor')
  }

  public async update(): Promise<void> {
    try {
      this.log.info('fetching bookmarks')
      const bookmarks = await this.pinboardClient.getAll()
      const { bookmarkCount, tagCounts } = this.count(bookmarks)

      await this.bookmarkRepository.save(bookmarkCount)
      await this.bookmarkTagCountRepository.save(
        BookmarkTagCount.createManyFromMap(tagCounts),
      )

      this.log.info('successfully fetched bookmarks')
    } catch (error) {
      throw new VError(error, 'bookmarks update failed')
    }
  }

  private count(
    bookmarks: Bookmark[],
  ): { bookmarkCount: BookmarkCount; tagCounts: Map<string, number> } {
    const count = new BookmarkCount()
    const tagCounts = new Map<string, number>()

    count.total = bookmarks.length

    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = bookmarks[i]
      if (bookmark.toread === 'yes') {
        count.unread++
      }

      if (bookmark.shared === 'no') {
        count.private++
      }

      const tags = bookmark.tags.split(' ')
      for (let j = 0; j < tags.length; j++) {
        const tag = tags[j]
        if (tag === '') {
          continue
        }

        const tagCount = tagCounts.get(tag)
        if (tagCount === undefined) {
          tagCounts.set(tag, 1)
        } else {
          tagCounts.set(tag, tagCount + 1)
        }
      }
    }

    return { bookmarkCount: count, tagCounts }
  }
}
