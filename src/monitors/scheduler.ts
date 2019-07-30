import { Injectable } from '@nestjs/common'
import {
  addSeconds,
  formatDistanceToNow,
  lightFormat,
  differenceInMilliseconds,
} from 'date-fns'

import { BookmarksMonitor } from '../bookmarks/bookmarks-monitor'
import { LogFactory, Logger } from '../logger/log-factory'
import { Monitor } from './monitor'

/**
 * Oversees scheduling and execution of `Monitor`s.
 */
@Injectable()
export class Scheduler {
  private readonly log: Logger
  // TODO store monitor classes too
  private readonly monitors: Readonly<Monitor[]>

  public constructor(log: LogFactory, bookmarksMonitor: BookmarksMonitor) {
    this.log = log.child('Scheduler')
    this.monitors = [bookmarksMonitor]
    this.initialize()
  }

  private async initialize(): Promise<void> {
    this.log.debug('initializing scheduler')
    for (const monitor of this.monitors) {
      // TODO add logic to get last check from monitor
      const nextUpdate = await this.getNextUpdateTime(monitor)
      this.scheduleUpdate(nextUpdate, monitor)
    }
  }

  private async getNextUpdateTime(monitor: Monitor): Promise<Date> {
    const lastUpdate = (await monitor.getLastUpdateTime()) || new Date()
    return addSeconds(lastUpdate, monitor.interval)
  }

  private scheduleUpdate(nextUpdate: Date, monitor: Monitor): void {
    const nextUpdateMs = differenceInMilliseconds(nextUpdate, new Date())
    this.log.debug(
      'scheduling update in %s (%s, %d seconds from now)',
      formatDistanceToNow(nextUpdate),
      lightFormat(nextUpdate, 'yyyy-MM-dd hh:mm:ssa'),
      nextUpdateMs / 1000,
    )
    setTimeout(
      (): void => void this.runUpdate((): Promise<void> => monitor.update()),
      nextUpdateMs,
    )
  }

  private async runUpdate(updater: Monitor['update']): Promise<void> {
    try {
      this.log.debug('running update')
      await updater()
      updater
    } catch (error) {
      this.log.error(error, 'update failed')
    }
  }
}
