import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Bookmark } from './bookmark'
import { BookmarkCount } from './bookmark-count.entity'
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
    private readonly repository: Repository<BookmarkCount>,
  ) {
    this.log = log.child('BookmarksMonitor')
  }

  public async update(): Promise<void> {
    try {
      this.log.info('fetching bookmarks')
      const bookmarks = await this.pinboardClient.getAll()
      const bookmarkCount = this.count(bookmarks)
      await this.repository.save(bookmarkCount)
      this.log.info('successfully fetched bookmarks')
    } catch (error) {
      this.log.error({ err: error })
      throw error
    }
  }

  private count(bookmarks: Bookmark[]): BookmarkCount {
    const count = new BookmarkCount()
    count.total = bookmarks.length
    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = bookmarks[i]
      if (bookmark.toread === 'yes') {
        count.unread++
      }

      if (bookmark.shared === 'no') {
        count.private++
      }
    }
    return count
  }

  public getLastUpdateTime(): Date | null {
    // TODO implement database check
    return new Date()
  }
}
