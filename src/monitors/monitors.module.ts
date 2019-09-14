import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BookmarksModule } from './bookmarks/bookmarks.module'
import { LoggerModule } from '../logger/logger.module'
import { Scheduler } from './scheduler'
import { TaskQueue } from './task-queue'
import { TaskRun } from './task-run.entity'

@Module({
  imports: [BookmarksModule, LoggerModule, TypeOrmModule.forFeature([TaskRun])],
  providers: [Scheduler, TaskQueue],
  exports: [Scheduler],
})
export class MonitorsModule {}
