import { Controller, Get } from '@nestjs/common'
import { LogFactory, Logger } from './logger/log-factory';

@Controller()
export class AppController {
  private readonly log: Logger

  constructor(log: LogFactory) {
    this.log = log.child('AppController')
    this.log.info('running')
  }

  @Get()
  public root(): object {
    return {
      uptime: process.uptime(),
    }
  }
}
