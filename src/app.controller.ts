import { Controller, Get, Res } from '@nestjs/common'
import {Response} from 'express'
import { join } from 'path'

import { LogFactory, Logger } from './logger/log-factory'

@Controller()
export class AppController {
  private readonly log: Logger

  public constructor(log: LogFactory) {
    this.log = log.child('AppController')
    this.log.info('running')
  }

  @Get()
  public root(): object {
    return {
      uptime: process.uptime(),
    }
  }

  @Get('docs')
  public docs(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', 'docs/index.html'))
  }
}
