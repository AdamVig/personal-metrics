import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import Queue, { QueueWorker } from 'queue'
import { Repository } from 'typeorm'

import { LogFactory, Logger } from '../logger/log-factory'
import { TaskRun } from './task-run.entity'

/**
 * Accepts tasks, automatically running them one at a time.
 */
@Injectable()
export class TaskQueue {
  private readonly log: Logger
  private readonly queue: Queue
  /** Map from task IDs (unique, single-use) to monitor names. */
  private readonly taskIdToMonitorName = new Map<string, string>()

  public constructor(
    log: LogFactory,
    @InjectRepository(TaskRun)
    private readonly repository: Repository<TaskRun>,
  ) {
    this.log = log.child('TaskQueue')
    this.queue = new Queue({
      concurrency: 1,
      autostart: true,
      // Twenty seconds
      timeout: 20000,
    })

    this.queue.on('start', (job: QueueWorker): void => this.handleStart(job))
    this.queue.on(
      'success',
      async (result: unknown, job: QueueWorker): Promise<void> =>
        await this.handleSuccess(result, job),
    )
    this.queue.on(
      'error',
      async (error: Error, job: QueueWorker): Promise<void> =>
        await this.handleError(error, job),
    )
    this.queue.on(
      'timeout',
      async (next: () => void, job: QueueWorker): Promise<void> =>
        await this.handleTimeout(next, job),
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
  private async handleSuccess(result: unknown, job: QueueWorker): Promise<void> {
    this.log.debug(
      { size: this.queue.length, task: job.name, result },
      'task "%s" succeeded',
      job.name,
    )
    await this.saveTaskRun(job.name, true)
  }
  private async handleError(error: Error, job: QueueWorker): Promise<void> {
    this.log.error(
      { size: this.queue.length, err: error, task: job.name },
      'task "%s" threw an error: %s',
      job.name,
      error.message,
    )
    await this.saveTaskRun(job.name, false)
  }
  private async handleTimeout(next: () => void, job: QueueWorker): Promise<void> {
    this.log.warn(
      { size: this.queue.length, task: job.name },
      'task "%s" timed out',
      job.name,
    )
    await this.saveTaskRun(job.name, false)
    next()
  }

  private async saveTaskRun(taskId: string, success: boolean): Promise<void> {
    const monitorName = this.taskIdToMonitorName.get(taskId)
    this.taskIdToMonitorName.delete(taskId)
    await this.repository.save({ id: taskId, monitorName, success })
  }

  private handleEnd(error?: Error): void {
    this.log.trace({ err: error }, 'queue ended')
  }

  public runTask(monitorName: string, task: () => Promise<void>): void {
    this.taskIdToMonitorName.set(task.name, monitorName)
    this.queue.push(task)
    this.log.trace({ size: this.queue.length }, 'added task "%s" to queue', task.name)
  }
}
