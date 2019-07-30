import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BookmarkCount } from './bookmark-count.entity'
import { BookmarksMonitor } from './bookmarks-monitor'
import { EnvironmentModule } from '../environment/environment.module'
import { HttpModule } from '../http/http.module'
import { LoggerModule } from '../logger/logger.module'
import { PinboardClient } from './pinboard-client'

@Module({
  imports: [
    EnvironmentModule,
    HttpModule,
    LoggerModule,
    TypeOrmModule.forFeature([BookmarkCount]),
  ],
  providers: [BookmarksMonitor, PinboardClient],
  exports: [BookmarksMonitor],
})
export class BookmarksModule {}
