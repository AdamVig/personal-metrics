import { Injectable } from '@nestjs/common'
import PQueue from 'p-queue'

import { LogFactory, Logger } from '../logger/log-factory'

/**
 * Accepts tasks, automatically running them one at a time.
 */
@Injectable()
export class TaskQueue {
  private readonly log: Logger
  private readonly queue: PQueue

  public constructor(log: LogFactory) {
    this.log = log.child('TaskQueue')
    this.queue = new PQueue({
      concurrency: 1,
      autoStart: true,
      // timeout: 5000,
    })
    this.queue.on('active', (): void => this.handleActiveEvent())
  }

  private handleActiveEvent(): void {
    this.log.trace({ size: this.queue.size, pending: this.queue.pending }, 'queue active')
  }

  public runTask(id: string, task: () => Promise<void>): void {
    this.queue.add(task)
    this.log.trace(
      { size: this.queue.size, pending: this.queue.pending },
      'added task "%s" to queue',
      id,
    )
  }
}
