import { Module } from '@nestjs/common'

import { BookmarksModule } from '../bookmarks/bookmarks.module'
import { LoggerModule } from '../logger/logger.module'
import { Scheduler } from './scheduler'

@Module({
  imports: [BookmarksModule, LoggerModule],
  providers: [Scheduler],
  exports: [Scheduler],
})
export class MonitorsModule {}
