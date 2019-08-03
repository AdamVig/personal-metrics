import { Injectable } from '@nestjs/common'
import Queue, { QueueWorker } from 'queue'

import { LogFactory, Logger } from '../logger/log-factory'

/**
 * Accepts tasks, automatically running them one at a time.
 */
@Injectable()
export class TaskQueue {
  private readonly log: Logger
  private readonly queue: Queue

  public constructor(log: LogFactory) {
    this.log = log.child('TaskQueue')
    this.queue = new Queue({
      concurrency: 1,
      autostart: true,
      timeout: 10000,
    })

    this.queue.on('start', (job: QueueWorker): void => this.handleStart(job))
    this.queue.on('success', (job: QueueWorker): void => this.handleSuccess(job))
    this.queue.on('error', (error: Error, job: QueueWorker): void =>
      this.handleError(error, job),
    )
    this.queue.on('timeout', (next: () => void, job: QueueWorker): void =>
      this.handleTimeout(next, job),
    )
    this.queue.on('end', (error?: Error): void => this.handleEnd(error))
  }

  private handleStart(job: QueueWorker): void {
    this.log.debug(
      { size: this.queue.length, task: job.name },
      'task "%s" started',
      job.name,
    )
  }
  private handleSuccess(job: QueueWorker): void {
    this.log.debug(
      { size: this.queue.length, task: job.name },
      'task "%s" succeeded',
      job.name,
    )
  }
  private handleError(error: Error, job: QueueWorker): void {
    this.log.error(
      { size: this.queue.length, err: error, task: job.name },
      'task "%s" threw an error',
      job.name,
    )
  }
  private handleTimeout(next: () => void, job: QueueWorker): void {
    this.log.warn(
      { size: this.queue.length, task: job.name },
      'task "%s" timed out',
      job.name,
    )
    next()
  }

  private handleEnd(error?: Error): void {
    this.log.trace({ err: error }, 'queue ended')
  }

  public runTask(task: () => Promise<void>): void {
    this.queue.push(task)
    this.log.trace({ size: this.queue.length }, 'added task "%s" to queue', task.name)
  }
}
