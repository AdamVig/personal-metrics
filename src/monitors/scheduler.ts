import { Injectable } from '@nestjs/common'
import {
  addSeconds,
  formatDistanceToNow,
  lightFormat,
  differenceInMilliseconds,
  differenceInSeconds,
} from 'date-fns'

import { BookmarksMonitor } from '../bookmarks/bookmarks-monitor'
import { LogFactory, Logger } from '../logger/log-factory'
import { Monitor } from './monitor'
import { TaskQueue } from './task-queue'

/**
 * Oversees scheduling of `Monitor`s.
 */
@Injectable()
export class Scheduler {
  private readonly log: Logger
  private readonly monitors: Readonly<Map<string, Monitor>> = new Map()

  public constructor(
    log: LogFactory,
    private readonly taskQueue: TaskQueue,
    bookmarksMonitor: BookmarksMonitor,
  ) {
    this.log = log.child('Scheduler')
    this.monitors.set('BookmarksMonitor', bookmarksMonitor)
    this.scheduleTasks()
  }

  private async scheduleTasks(): Promise<void> {
    await Promise.all(
      Array.from(this.monitors.entries()).map(
        ([name, monitor]): Promise<void> => this.scheduleTask(name, monitor),
      ),
    )
  }

  private async scheduleTask(name: string, monitor: Monitor): Promise<void> {
    const nextRun = await this.getNextRun(monitor)
    this.logNextRun(name, nextRun)
    const nextRunMs = differenceInMilliseconds(nextRun, new Date())

    const taskName = `${name}-${nextRunMs}`
    // Set function name so it can be easily differentiated in the queue
    const namedMonitorUpdate = {
      [taskName](): Promise<void> {
        return monitor.update()
      },
    }[taskName]
    // TODO this only runs once, add repeated scheduling
    setTimeout((): void => void this.taskQueue.runTask(namedMonitorUpdate), nextRunMs)
  }

  private async getNextRun(monitor: Monitor): Promise<Date> {
    const lastRun = (await monitor.getLastUpdateTime()) || new Date()
    return addSeconds(lastRun, monitor.interval)
  }

  private logNextRun(name: string, nextRun: Date): void {
    this.log.debug(
      'scheduling update for "%s" in %s (%s, %d seconds from now)',
      name,
      formatDistanceToNow(nextRun),
      lightFormat(nextRun, 'yyyy-MM-dd hh:mm:ssa'),
      differenceInSeconds(nextRun, new Date()),
    )
  }
}
