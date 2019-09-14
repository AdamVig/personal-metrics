import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  addSeconds,
  formatDistanceToNow,
  lightFormat,
  differenceInMilliseconds,
  differenceInSeconds,
} from 'date-fns'
import { Repository } from 'typeorm'

import { BookmarksMonitor } from './bookmarks/bookmarks-monitor'
import { LogFactory, Logger } from '../logger/log-factory'
import { Monitor } from './monitor'
import { TaskQueue } from './task-queue'
import { TaskRun } from './task-run.entity'

/**
 * Oversees scheduling of `Monitor`s.
 */
@Injectable()
export class Scheduler {
  private readonly log: Logger
  private readonly monitors: Set<Monitor>

  public constructor(
    log: LogFactory,
    private readonly taskQueue: TaskQueue,
    bookmarksMonitor: BookmarksMonitor,
    @InjectRepository(TaskRun)
    private readonly repository: Repository<TaskRun>,
  ) {
    this.log = log.child('Scheduler')
    this.monitors = new Set([bookmarksMonitor])
    this.scheduleTasks()
  }

  private async scheduleTasks(): Promise<void> {
    await Promise.all(
      Array.from(this.monitors).map(
        (monitor): Promise<void> => this.scheduleTask(monitor),
      ),
    )
  }

  private async scheduleTask(monitor: Monitor): Promise<void> {
    const name = monitor.constructor.name
    const nextRun = await this.getNextRun(monitor)
    this.logNextRun(name, nextRun)
    const nextRunMs = differenceInMilliseconds(nextRun, new Date())

    const taskId = `${name}-${nextRunMs}`

    // Set function name so it can be easily differentiated in the queue
    const namedMonitorUpdate = {
      [taskId](): Promise<void> {
        return monitor.update()
      },
    }[taskId]

    // Run task `interval` seconds from its last run, then run it every `interval` second after that
    setTimeout((): void => {
      this.taskQueue.runTask(name, namedMonitorUpdate)
      setInterval(
        (): void => this.taskQueue.runTask(name, namedMonitorUpdate),
        monitor.interval * 1000,
      )
    }, nextRunMs)
  }

  private async getNextRun(monitor: Monitor): Promise<Date> {
    const lastRun = (await this.getLastRun(monitor)) || new Date()
    return addSeconds(lastRun, monitor.interval)
  }

  private async getLastRun(monitor: Monitor): Promise<Date | null> {
    const taskRuns = await this.repository.find({ monitorName: monitor.constructor.name })
    if (taskRuns.length === 0) {
      return null
    } else {
      return taskRuns[taskRuns.length - 1].time
    }
  }

  private logNextRun(name: string, nextRun: Date): void {
    this.log.info(
      'scheduling update for "%s" in %s (%s, %d seconds from now)',
      name,
      formatDistanceToNow(nextRun),
      lightFormat(nextRun, 'yyyy-MM-dd hh:mm:ssa'),
      differenceInSeconds(nextRun, new Date()),
    )
  }
}
