import { Module } from '@nestjs/common'

import { BookmarksModule } from '../bookmarks/bookmarks.module'
import { Scheduler } from './scheduler'

@Module({
  imports: [BookmarksModule],
  providers: [Scheduler],
  exports: [Scheduler],
})
export class MonitorsModule {}
