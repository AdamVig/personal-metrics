import { Module } from '@nestjs/common'

import { BookmarksModule } from '../bookmarks/bookmarks.module'
import { LoggerModule } from '../logger/logger.module'
import { Scheduler } from './scheduler'
import { TaskQueue } from './task-queue'

@Module({
  imports: [BookmarksModule, LoggerModule],
  providers: [Scheduler, TaskQueue],
  exports: [Scheduler],
})
export class MonitorsModule {}
